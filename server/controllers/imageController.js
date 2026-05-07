const jwt = require('jsonwebtoken');
const multer = require('multer');
const Image = require('../models/Image');
const imagekit = require('../utils/imagekit');
const mailer = require('../utils/mailer');

// multer: store in memory so we can pass buffer to ImageKit
const upload = multer({ storage: multer.memoryStorage() });
exports.upload = upload.single('image');

const PAGE_SIZE = 20;

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

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  // Always return success to prevent email enumeration probing
  const successMsg = { message: 'Password sent to your registered email.' };
  try {
    await mailer.sendMail({
      from: `"Kliks Admin" <${process.env.GMAIL_USER}>`,
      to:   process.env.ADMIN_EMAIL,
      subject: 'Kliks Admin — Your Password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;">
          <h2 style="margin-bottom:8px;">Kliks Admin</h2>
          <p style="color:#555;">You requested your admin password. Here it is:</p>
          <div style="background:#f4f4f4;padding:16px 20px;border-radius:8px;font-size:20px;letter-spacing:2px;font-weight:bold;margin:16px 0;">
            ${process.env.ADMIN_PASSWORD}
          </div>
          <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Forgot-password email failed:', err.message);
  }
  res.json(successMsg);
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
      // log but don't block deletion from DB if ImageKit file is already gone
      console.error('ImageKit delete failed:', err.message);
    }
  }

  await doc.deleteOne();
  res.json({ message: 'Deleted successfully' });
};
