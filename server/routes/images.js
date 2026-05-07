const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/imageController');
const auth = require('../middleware/auth');

router.post('/auth/login', ctrl.login);
router.post('/auth/forgot-password', async (req, res) => {
  try { await ctrl.forgotPassword(req, res); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/images', async (req, res) => {
  try {
    await ctrl.getImages(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', auth, ctrl.upload, async (req, res) => {
  try {
    await ctrl.uploadImage(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/images/:id', auth, async (req, res) => {
  try {
    await ctrl.deleteImage(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
