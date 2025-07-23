const mongoose = require('mongoose');

const skillSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  schedule: Date,
  isLive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SkillSession', skillSessionSchema);
