const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');

// Get messages for a session
router.get('/:sessionId', auth, async (req, res) => {
  const messages = await Message.find({ sessionId: req.params.sessionId })
    .populate('sender', 'name')
    .sort({ timestamp: 1 });

  res.json(messages);
});

// Post a new message (optional fallback for Socket.io)
router.post('/:sessionId', auth, async (req, res) => {
  const newMessage = await Message.create({
    sessionId: req.params.sessionId,
    sender: req.user._id,
    content: req.body.content,
  });

  res.status(201).json(newMessage);
});

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reactions: [
    {
      emoji: String,
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
  ]
});

//Seen By
router.get('/seen/:messageId', async (req, res) => {
  try {
    const msg = await Message.findById(req.params.messageId);
    res.json({ seenByCount: msg.seenBy.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seen count' });
  }
});




module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = router;
