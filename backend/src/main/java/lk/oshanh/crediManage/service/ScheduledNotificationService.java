package lk.oshanh.credimanage.service;

import lk.oshanh.credimanage.repository.DebitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScheduledNotificationService {

    @Autowired
    private DebitRepository debitRepository;

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

        // Get debits that are due in the next 5 minutes (you can adjust this timeframe as needed)
        //List<Debit> debitsDueSoon = debitRepository.findAll();

        // Send WhatsApp notifications for each due debit
//        for (Debit debit : debitsDueSoon) {
//            // Send message via WhatsApp
//            String message = "Dear customer, your debit for " + debit.getDescription() + " is due soon. Please pay before " + debit.getDueDate() + ".\n"+"Debit Amount : Rs."+debit.getDebitAmount();
//            whatsAppService.sendWhatsAppMessage(debit.getCustomer().getContactNumber(), message);
//            System.out.println("Sent notification for debit: " + debit.getDescription());
//        }
    }
}
