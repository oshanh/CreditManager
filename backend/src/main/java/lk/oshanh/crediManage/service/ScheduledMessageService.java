package lk.oshanh.credimanage.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ScheduledMessageService {

    private final SimpMessagingTemplate messagingTemplate;

    public ScheduledMessageService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    //@Scheduled(fixedRate = 5000) // Every 5 seconds
    public void sendPeriodicMessages() {
        messagingTemplate.convertAndSend("/topic/messages", "🔥 Periodic Server Message!");
    }
}