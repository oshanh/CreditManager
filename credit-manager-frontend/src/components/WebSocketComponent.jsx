import React, { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket } from "../services/websocket";

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Pass a callback to update state when a message is received
    connectWebSocket((message) => {
      setMessages((prev) => [...prev, message]);
      console.log("📩 Inside Component:", message);
    });

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <div>
      <h2>🔥 WebSocket Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
