package lk.oshanh.crediManage.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;

//@Service
public class WhatsAppService {

    private String ACCOUNT_SID;


    //@Value("${twilio.auth.token}")
    private String AUTH_TOKEN;


    private String FROM_WHATSAPP_NUMBER;


    // Initialize Twilio
    public WhatsAppService(@Value("${twilio.account.sid}") String sid,@Value("${twilio.auth.token}") String token,@Value("${twilio.whatsapp.number}") String number) {
        this.ACCOUNT_SID=sid;
        this.AUTH_TOKEN=token;
        this.FROM_WHATSAPP_NUMBER=number;



        System.out.println("\n\n"+ACCOUNT_SID+"\n"+AUTH_TOKEN+"\n"+FROM_WHATSAPP_NUMBER+"\n\n");
//        if (ACCOUNT_SID == null || AUTH_TOKEN == null || FROM_WHATSAPP_NUMBER == null) {
//
//            throw new IllegalArgumentException("Twilio credentials are not set properly.");
//        }

     //Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    // Method to send WhatsApp message
    public void sendWhatsAppMessage(String toPhoneNumber, String messageBody) {
        Message.creator(
                new PhoneNumber("whatsapp:" + toPhoneNumber),  // To customer's WhatsApp number
                new PhoneNumber("whatsapp:" + FROM_WHATSAPP_NUMBER),  // From your Twilio WhatsApp number
                messageBody
        ).create();
    }
}
