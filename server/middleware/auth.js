const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bodyToken = req.body && req.body.token;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : bodyToken;

  if (!token) return res.status(401).json({ error: 'No token provided' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // require session jti
  if (!payload.jti) return res.status(401).json({ error: 'Invalid or expired token' });

  const session = await Session.findById(payload.jti);
  if (!session || !session.valid) return res.status(401).json({ error: 'Invalid or expired token' });

  const admin = await Admin.findById(session.adminId);
  if (!admin) return res.status(401).json({ error: 'Invalid or expired token' });

  // if password changed after token issuance, force logout with specific message
  if (admin.passwordChangedAt && payload.iat * 1000 < admin.passwordChangedAt.getTime()) {
    return res.status(401).json({ error: 'Password changed. Relogin to access the page' });
  }

  // attach user and session info
  req.user = payload;
  req.admin = admin;
  req.session = session;
  // update lastSeenAt
  session.lastSeenAt = new Date();
  session.save().catch(() => {});

  next();
};
