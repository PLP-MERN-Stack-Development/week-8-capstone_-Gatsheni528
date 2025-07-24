import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(import.meta.env.VITE_BACKEND_URL);
const emojiOptions = ['👍', '❤️', '😂', '🔥', '😮'];
const notificationSound = new Audio('/notify.mp3');

const ChatBox = ({ currentUser }) => {
  const { sessionId } = useParams(); // dynamic route
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const chatEndRef = useRef(null);

  // Join session and fetch messages
  useEffect(() => {
    if (!sessionId || !currentUser) return;

    socket.emit('joinSession', sessionId);
    axios.get(`/api/chat/${sessionId}`).then((res) => setMessages(res.data));

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender?._id !== currentUser._id) {
        toast.info(`${msg.sender?.username || 'Someone'} sent a message`);
        notificationSound.play();
      }
    };

    const handleSeenUpdate = ({ messageId, userId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId && !msg.seenBy.includes(userId)
            ? { ...msg, seenBy: [...msg.seenBy, userId] }
            : msg
        )
      );
    };

    const handleTyping = (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(null), 2000);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageSeenUpdate', handleSeenUpdate);
    socket.on('typing', handleTyping);

    return () => {
      socket.emit('leaveSession', sessionId);
      socket.off('newMessage', handleNewMessage);
      socket.off('messageSeenUpdate', handleSeenUpdate);
      socket.off('typing', handleTyping);
    };
  }, [sessionId, currentUser]);

  // Mark last message as seen
  useEffect(() => {
    if (messages.length && currentUser) {
      const lastMsg = messages[messages.length - 1];
      socket.emit('messageSeen', {
        messageId: lastMsg._id,
        userId: currentUser._id,
      });
    }
  }, [messages, currentUser]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() && !file) return;

    try {
      let msgData;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axios.post(`/api/chat/upload/${sessionId}`, formData, {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
        });
        msgData = data;
        setFile(null);
      } else {
        const { data } = await axios.post(
          `/api/chat/${sessionId}`,
          { text: message },
          { headers }
        );
        msgData = data;
      }

      socket.emit('sendMessage', msgData);
      setMessage('');
    } catch (err) {
      console.error('Send error:', err);
      toast.error('Failed to send message');
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      const { data } = await axios.post(
        '/api/chat/react',
        { messageId, emoji },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, reactions: data.reactions } : msg
          )
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
        {/* Messages */}
        <div className="overflow-y-auto border mb-2 p-2 flex-1">
          {messages.map((msg) => (
            <div key={msg._id} className="mb-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{msg.sender?.username || 'User'}:</span>
                <span className="text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {msg.fileUrl ? (
                <div className="p-2 bg-gray-100 rounded">
                  {/\.(jpe?g|png|gif)$/i.test(msg.fileUrl) ? (
                    <img src={msg.fileUrl} alt="upload" className="max-w-xs rounded" />
                  ) : (
                    <a
                      href={msg.fileUrl}
                      download
                      className="text-blue-600 underline"
                    >
                      {msg.text || 'Download File'}
                    </a>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 p-2 rounded">{msg.text}</div>
              )}

              {/* Reactions */}
              <div className="flex gap-2 mt-1 flex-wrap">
                {msg.reactions?.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleReaction(msg._id, r.emoji)}
                    className="text-sm bg-gray-200 px-1 rounded"
                  >
                    {r.emoji} {r.users.length}
                  </button>
                ))}
                {emojiOptions.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleReaction(msg._id, emoji)}
                    className="text-sm hover:bg-gray-200 px-1 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Seen By */}
              {msg.seenBy?.length > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  Seen by {msg.seenBy.length} {msg.seenBy.length === 1 ? 'user' : 'users'}
                </div>
              )}
            </div>
          ))}

          {typingUser && (
            <div className="text-sm text-gray-500">{typingUser.name} is typing...</div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input controls */}
        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => setShowPicker((prev) => !prev)}
            className="text-xl"
            title="Emoji Picker"
          >
            😊
          </button>

          {showPicker && (
            <div className="absolute bottom-12 z-20">
              <Picker
                data={data}
                onEmojiSelect={(emoji) => setMessage((msg) => msg + emoji.native)}
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded px-1"
            aria-label="Upload file"
          />

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            className="flex-1 border rounded p-1"
            placeholder="Type your message"
          />

          <button
            type="button"
            onClick={handleSend}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
