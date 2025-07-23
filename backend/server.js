const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/chat', require('./routes/chat'));
app.use('/uploads', express.static('uploads'));




io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinSession', (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session ${sessionId}`);
  });

  socket.on('sendMessage', ({ sessionId, msg }) => {
    io.to(sessionId).emit('receiveMessage', msg);
  });

  socket.on('leaveSession', (sessionId) => {
    socket.leave(sessionId);
    console.log(`User left session ${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  const Message = require('./models/Message');

  socket.on('messageSeen', async ({ messageId, userId }) => {
  try {
    const msg = await Message.findById(messageId);
    if (!msg.seenBy.includes(userId)) {
      msg.seenBy.push(userId);
      await msg.save();
      io.to(msg.sessionId.toString()).emit('messageSeenUpdate', {
        messageId,
        userId
      });
    }
  } catch (err) {
    console.error('Seen update error:', err);
  }
});


 socket.on('chatMessage', async ({ sessionId, senderId, content }) => {
    const message = new Message({ sessionId, sender: senderId, content });
    await message.save();

    io.to(sessionId).emit('chatMessage', {
      _id: message._id,
      sender: senderId,
      content,
      timestamp: message.timestamp,
    });
  });

  socket.on('newMessage', (msg) => {
  setMessages((prev) => [...prev, msg]);
  if (msg.sender._id !== currentUser._id) {
    toast.info(`${msg.sender.username || 'Someone'} sent a message`);
    notificationSound.play();
  }
});


io.on('connection', (socket) => {
  socket.on('joinSession', ({ sessionId }) => {
    socket.join(sessionId);
  });

 
});

});


mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log('Server running...');
  });
}).catch(err => console.error(err));