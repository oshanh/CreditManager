package lk.oshanh.crediManage.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Component
public class CreditDueNotificationScheduler {

//    @Autowired
//    private WhatsAppNotificationService notificationService;

    @Scheduled(fixedRate = 1000) // Runs daily at 9 AM
    public void checkAndSendNotifications() {


            String message = String.format(
                    "Reminder:your credit of LKR  is due on . Please settle it before the due date.");
            //notificationService.sendWhatsAppMessage("94716536966", message);
            //notificationService.sendWhatsAppMessage("94717529331", message);
        }
    }

