package lk.oshanh.debitmanager.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/send") // When frontend sends a message
    @SendTo("/topic/messages") // Broadcast it to all subscribers
    public String sendMessage(String message) {
        return "📢 Server Broadcast: " + message;
    }
}