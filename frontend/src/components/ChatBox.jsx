import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(import.meta.env.VITE_BACKEND_URL);

const emojiOptions = ['👍', '❤️', '😂', '🔥', '😮'];
const notificationSound = new Audio('/notify.mp3');

const ChatBox = ({ sessionId, currentUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinSession', sessionId);
    axios.get(`/api/chat/${sessionId}`).then((res) => setMessages(res.data));

    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender._id !== currentUser._id) {
        toast.info(`${msg.sender.username || 'Someone'} sent a message`);
        notificationSound.play();
      }
    });

    socket.on('messageSeenUpdate', ({ messageId, userId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId && !msg.seenBy.includes(userId)
            ? { ...msg, seenBy: [...msg.seenBy, userId] }
            : msg
        )
      );
    });

    socket.on('typing', (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(null), 2000);
    });

    return () => {
      socket.emit('leaveSession', sessionId);
    };
  }, [sessionId]);

  useEffect(() => {
    if (messages.length > 0 && currentUser) {
      const lastMsg = messages[messages.length - 1];
      socket.emit('messageSeen', {
        messageId: lastMsg._id,
        userId: currentUser._id
      });
    }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() && !file) return;

    try {
      let msgData;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(`/api/chat/upload/${sessionId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        msgData = res.data;
        setFile(null);
      } else {
        const res = await axios.post(`/api/chat/${sessionId}`, { text: message }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        msgData = res.data;
      }

      socket.emit('sendMessage', msgData);
      setMessage('');
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      const res = await axios.post('/api/chat/react', { messageId, emoji }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setMessages(prev =>
          prev.map(msg => msg._id === messageId ? { ...msg, reactions: res.data.reactions } : msg)
        );
      }
    } catch (err) {
      console.error('Reaction error:', err);
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { user: currentUser, sessionId });
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4 bg-white shadow rounded max-w-xl w-full mx-auto h-[70vh] sm:h-[60vh] flex flex-col">
        <div className="overflow-y-auto border mb-2 p-2 flex-1">
          {messages.map((msg) => (
            <div key={msg._id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{msg.sender?.username || 'User'}:</span>
                <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              {msg.fileUrl ? (
                <div className="p-2 rounded bg-gray-100">
                  {msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img src={msg.fileUrl} alt="upload" className="max-w-xs rounded" />
                  ) : (
                    <a href={msg.fileUrl} download className="text-blue-600 underline">{msg.text}</a>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 p-2 rounded">{msg.text}</div>
              )}
              <div className="flex gap-2 mt-1 flex-wrap">
                {msg.reactions?.map((r, idx) => (
                  <button key={idx} className="text-sm bg-gray-200 px-1 rounded" onClick={() => handleReaction(msg._id, r.emoji)}>
                    {r.emoji} {r.users.length}
                  </button>
                ))}
                {emojiOptions.map((emoji, idx) => (
                  <button key={idx} className="text-sm hover:bg-gray-200 px-1 rounded" onClick={() => handleReaction(msg._id, emoji)}>
                    {emoji}
                  </button>
                ))}
              </div>
              {msg.seenBy && msg.seenBy.length > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  Seen by {msg.seenBy.length} {msg.seenBy.length === 1 ? 'user' : 'users'}
                </div>
              )}
            </div>
          ))}
          {typingUser && <div className="text-sm text-gray-500">{typingUser.name} is typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="flex items-center gap-2 relative">
          <button onClick={() => setShowPicker(val => !val)}>😊</button>
          {showPicker && (
            <div className="absolute bottom-12 z-10">
              <Picker data={data} onEmojiSelect={(emoji) => setMessage(msg => msg + emoji.native)} />
            </div>
          )}
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border rounded px-1" />
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleTyping} className="flex-1 border rounded p-1" />
          <button onClick={handleSend} className="bg-blue-500 text-white px-2 py-1 rounded">Send</button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
