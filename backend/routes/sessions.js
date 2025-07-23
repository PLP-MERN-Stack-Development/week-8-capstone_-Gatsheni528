const express = require('express');
const SkillSession = require('../models/SkillSession');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a session
router.post('/', auth, async (req, res) => {
  try {
    const session = await SkillSession.create({ ...req.body, host: req.user._id });
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all sessions
router.get('/', async (req, res) => {
  const sessions = await SkillSession.find().populate('host', 'name');
  res.json(sessions);
});

// Get single session
router.get('/:id', async (req, res) => {
  const session = await SkillSession.findById(req.params.id).populate('host participants', 'name');
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// Join session
router.post('/:id/join', auth, async (req, res) => {
  const session = await SkillSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  if (!session.participants.includes(req.user._id)) {
    session.participants.push(req.user._id);
    await session.save();
  }

  res.json(session);
});

// Leave session
router.post('/:id/leave', auth, async (req, res) => {
  const session = await SkillSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  session.participants = session.participants.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await session.save();

  res.json(session);
});

module.exports = router;
