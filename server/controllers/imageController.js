const jwt = require('jsonwebtoken');
const multer = require('multer');
const Image = require('../models/Image');
const imagekit = require('../utils/imagekit');
const mailer = require('../utils/mailer');

const upload = multer({ storage: multer.memoryStorage() });
exports.upload = upload.single('image');

const PAGE_SIZE = 20;

// In-memory OTP store: { otp -> expiresAt }
const otpStore = new Map();

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// POST /api/auth/login
exports.login = (req, res) => {
  const { username, password } = req.body;
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};

// POST /api/auth/forgot-password — send OTP
exports.forgotPassword = async (req, res) => {
  otpStore.clear(); // invalidate any previous OTPs
  const otp = generateOtp();
  otpStore.set(otp, Date.now() + 10 * 60 * 1000); // expires in 10 min

  try {
    await mailer.sendMail({
      from: 'Kliks Admin <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: 'Kliks Admin — Your OTP',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;">
          <h2 style="margin-bottom:8px;">Kliks Admin</h2>
          <p style="color:#555;">Use this OTP to retrieve your password. It expires in 10 minutes.</p>
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

// POST /api/auth/verify-otp — verify OTP and email the password
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ error: 'OTP is required.' });

  const expiresAt = otpStore.get(otp);
  if (!expiresAt || Date.now() > expiresAt) {
    otpStore.delete(otp);
    return res.status(400).json({ error: 'Invalid or expired OTP.' });
  }

  otpStore.delete(otp); // one-time use

  try {
    await mailer.sendMail({
      from: 'Kliks Admin <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: 'Kliks Admin — Your Password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;">
          <h2 style="margin-bottom:8px;">Kliks Admin</h2>
          <p style="color:#555;">OTP verified. Here is your admin password:</p>
          <div style="background:#f4f4f4;padding:16px 20px;border-radius:8px;font-size:20px;letter-spacing:2px;font-weight:bold;margin:16px 0;">
            ${process.env.ADMIN_PASSWORD}
          </div>
          <p style="color:#999;font-size:12px;">Keep this safe.</p>
        </div>
      `,
    });
    res.json({ message: 'Password sent to your registered email.' });
  } catch (err) {
    console.error('Password email failed:', err.message);
    res.status(500).json({ error: 'OTP verified but failed to send password email.' });
  }
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
