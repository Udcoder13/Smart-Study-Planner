const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  color: String,
  totalTopics: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
