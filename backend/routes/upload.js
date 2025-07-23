const express = require('express');
const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload/:sessionId', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const newMessage = new Message({
      sender: req.user.id,
      sessionId: req.params.sessionId,
      text: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      timestamp: new Date()
    });

    const saved = await newMessage.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
