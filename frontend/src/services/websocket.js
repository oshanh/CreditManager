import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketUrl = "http://localhost:8081/ws"; // WebSocket URL
const creditTopic = "/topic/credit"; // Topic for credit notifications

let messageCallback = null; // Store callback to update state

const client = new Client({
  webSocketFactory: () => new SockJS(socketUrl),
  reconnectDelay: 5000,
  onConnect: () => {
    console.log("✅ Connected to WebSocket");

    client.subscribe(creditTopic, (message) => {
      console.log("💰 Received Credit Notification:", message.body);

      if (messageCallback) {
        messageCallback(message.body);
      }
    });
  },
  onStompError: (frame) => {
    console.error("🚨 STOMP Error:", frame.headers["message"]);
  },
  onDisconnect: () => {
    console.log("🛑 Disconnected from WebSocket");
  },
});

export const connectWebSocket = (callback) => {
  console.log("⚡ Activating WebSocket...");
  messageCallback = callback; // Set callback function
  client.activate();
};

export const disconnectWebSocket = () => {
  console.log("🔌 Deactivating WebSocket...");
  client.deactivate();
};
