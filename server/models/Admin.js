const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordChangedAt: { type: Date },
});

module.exports = mongoose.model('Admin', schema);
