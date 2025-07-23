import React, { useEffect, useState } from "react";
import socket from "../socket";

const ChatWindow = () => {
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
    <div>
      {/* Render chat UI */}
    </div>
  );
};

export default ChatWindow;
