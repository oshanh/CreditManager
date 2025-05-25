package lk.oshanh.credimanage.service;

import lk.oshanh.credimanage.repository.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScheduledNotificationService {

    @Autowired
    private CreditRepository creditRepository;

//    @Autowired
//    private WhatsAppService whatsAppService;

    //@Scheduled(fixedRate = 200000)
    public void sendScheduledNotificationsTest() {
        System.out.println("Running scheduled task...");
        // Your logic for sending notifications
    }

    // Scheduled task to send WhatsApp notifications every 5 minutes
    //@Scheduled(fixedRate = 500000)  // 300000 ms = 5 minutes
    public void sendScheduledNotifications() {
        // Get current date
        //Date currentDate = new Date();

        // Get credits that are due in the next 5 minutes (you can adjust this timeframe as needed)
        //List<Credit> creditsDueSoon = creditRepository.findAll();

        // Send WhatsApp notifications for each due credit
//        for (Credit credit : creditsDueSoon) {
//            // Send message via WhatsApp
//            String message = "Dear customer, your credit for " + credit.getDescription() + " is due soon. Please pay before " + credit.getDueDate() + ".\n"+"Credit Amount : Rs."+credit.getCreditAmount();
//            whatsAppService.sendWhatsAppMessage(credit.getCustomer().getContactNumber(), message);
//            System.out.println("Sent notification for credit: " + credit.getDescription());
//        }
    }
}
