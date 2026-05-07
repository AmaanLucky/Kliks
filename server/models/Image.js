const { Schema, model } = require('mongoose');

const ImageSchema = new Schema({
  title:     { type: String, required: true, trim: true },
  imageUrl:  { type: String, required: true },
  fileId:    { type: String, default: '' }, // ImageKit fileId for deletion
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Image', ImageSchema);
