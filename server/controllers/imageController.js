const jwt = require('jsonwebtoken');
const multer = require('multer');
const Image = require('../models/Image');
const Admin = require('../models/Admin');
const imagekit = require('../utils/imagekit');
const mailer = require('../utils/mailer');

const upload = multer({ storage: multer.memoryStorage() });
exports.upload = upload.single('image');

const PAGE_SIZE = 20;

const otpStore = new Map();
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// POST /api/auth/login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};

// POST /api/auth/forgot-password — generate OTP and email it
exports.forgotPassword = async (req, res) => {
  otpStore.clear();
  const otp = generateOtp();
  otpStore.set(otp, Date.now() + 10 * 60 * 1000);

  try {
    await mailer.sendMail({
      from: 'Kliks Admin <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: 'Kliks Admin — Your OTP',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;">
          <h2 style="margin-bottom:8px;">Kliks Admin</h2>
          <p style="color:#555;">Use this OTP to reset your password. It expires in 10 minutes.</p>
          <div style="background:#f4f4f4;padding:16px 20px;border-radius:8px;font-size:32px;letter-spacing:8px;font-weight:bold;margin:16px 0;text-align:center;">
            ${otp}
          </div>
          <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
    res.json({ message: 'OTP sent to your registered email.' });
  } catch (err) {
    console.error('OTP email failed:', err.message);
    res.status(500).json({ error: 'Failed to send OTP. Try again.' });
  }
};

// POST /api/auth/verify-otp — verify OTP, return a short-lived reset token
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ error: 'OTP is required.' });

  const expiresAt = otpStore.get(otp);
  if (!expiresAt || Date.now() > expiresAt) {
    otpStore.delete(otp);
    return res.status(400).json({ error: 'Invalid or expired OTP.' });
  }

  otpStore.delete(otp);
  const resetToken = jwt.sign({ type: 'password-reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ resetToken });
};

// POST /api/auth/reset-password — validate reset token, update password in DB
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ error: 'Missing fields.' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  try {
    const payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (payload.type !== 'password-reset') throw new Error('Invalid token type');
  } catch {
    return res.status(400).json({ error: 'Reset session is invalid or expired. Please request a new OTP.' });
  }

  const admin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
  if (!admin) return res.status(500).json({ error: 'Admin not found.' });

  admin.password = newPassword;
  await admin.save();

  res.json({ message: 'Password updated successfully.' });
};

// GET /api/images?page=1
exports.getImages = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [images, total] = await Promise.all([
    Image.find().sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE).lean(),
    Image.countDocuments(),
  ]);

  res.json({
    images: images.map(doc => ({
      id:        doc._id,
      src:       doc.imageUrl,
      title:     doc.title,
      createdAt: doc.createdAt,
    })),
    total,
    page,
    pages: Math.ceil(total / PAGE_SIZE),
  });
};

// POST /api/upload  (requires auth + multer middleware)
exports.uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });

  const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;

  const ikResponse = await imagekit.upload({
    file:   req.file.buffer,
    fileName,
    folder: '/KliksImages',
  });

  const doc = await Image.create({
    title:    title.trim(),
    imageUrl: ikResponse.url,
    fileId:   ikResponse.fileId,
  });

  res.status(201).json({
    id:        doc._id,
    src:       doc.imageUrl,
    title:     doc.title,
    createdAt: doc.createdAt,
  });
};

// DELETE /api/images/:id  (requires auth)
exports.deleteImage = async (req, res) => {
  const doc = await Image.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Image not found' });

  if (doc.fileId) {
    try {
      await imagekit.deleteFile(doc.fileId);
    } catch (err) {
      console.error('ImageKit delete failed:', err.message);
    }
  }

  await doc.deleteOne();
  res.json({ message: 'Deleted successfully' });
};
