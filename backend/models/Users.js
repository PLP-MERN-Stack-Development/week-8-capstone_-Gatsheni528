const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  skillsToTeach: [String],
  skillsToLearn: [String],
  sessionsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SkillSession' }],
  sessionsHosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SkillSession' }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Password check method
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
