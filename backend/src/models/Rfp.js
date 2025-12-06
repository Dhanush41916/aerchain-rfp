const mongoose = require('mongoose');

const rfpSchema = new mongoose.Schema({
  title: String,
  extractedText: String,
  score: Number,
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rfp', rfpSchema);
