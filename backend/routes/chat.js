const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const verifyToken = require('../middleware/verifyToken');

router.post('/react', verifyToken, async (req, res) => {
  const { messageId, emoji } = req.body;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    let reaction = message.reactions.find(r => r.emoji === emoji);
    if (reaction) {
      const hasReacted = reaction.users.includes(userId);
      if (hasReacted) {
        // Remove reaction
        reaction.users = reaction.users.filter(uid => uid.toString() !== userId);
      } else {
        // Add reaction
        reaction.users.push(userId);
      }
    } else {
      message.reactions.push({ emoji, users: [userId] });
    }

    await message.save();
    res.json({ success: true, reactions: message.reactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
