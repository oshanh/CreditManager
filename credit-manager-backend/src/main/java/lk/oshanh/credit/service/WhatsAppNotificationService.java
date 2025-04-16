package lk.oshanh.credit.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

//@Service
public class WhatsAppNotificationService {

    @Value("${whatsapp.api.url}")
    private String apiUrl;

    @Value("${whatsapp.phone.id}")
    private String phoneId;

    @Value("${whatsapp.access.token}")
    private String accessToken;

    private static final String MESSAGE_TEMPLATE = """
    {
      "messaging_product": "whatsapp",
      "to": "%s",
      "type": "template",
      "template": {
        "name": "hello_world",
        "language": { "code": "en_US" }
      }
    }
    """;


    public void sendWhatsAppMessage(String to, String message) {

        RestTemplate restTemplate = new RestTemplate();
        String url = apiUrl + phoneId + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        String requestBody = MESSAGE_TEMPLATE.formatted(to, message);
        //System.out.println(requestBody);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        //System.out.println(request);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        System.out.println("WhatsApp API Response: " + response.getBody());
    }
}
