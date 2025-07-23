import React, { useEffect, useState } from "react";
import socket from "../socket";
import ChatInput from "../components/ChatInput";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = (msg) => {
    socket.emit("sendMessage", { text: msg, time: new Date().toISOString() });
  };

  return (
    <div className="p-4">
      <div className="h-96 overflow-y-auto border mb-4 p-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span>{msg.text}</span>{" "}
            <span className="text-xs text-gray-400">{new Date(msg.time).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatPage;