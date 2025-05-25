package lk.oshanh.credimanage.controller;

import lk.oshanh.credimanage.dto.CreditDTO;
import lk.oshanh.credimanage.service.CreditService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/credits")

public class CreditController {

    private final CreditService creditService;

    public CreditController(CreditService creditService) {
        this.creditService = creditService;
    }

//    @Autowired
//    private WhatsAppService whatsAppService;

    @PostMapping
    public ResponseEntity<CreditDTO> createCredit(@RequestBody CreditDTO creditDTO) {
        CreditDTO createdCredit = creditService.createCredit(creditDTO);
        return new ResponseEntity<>(createdCredit, HttpStatus.CREATED);
    }

    @GetMapping
    public List<CreditDTO> getAllCredits() {
        return creditService.getAllCredits();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreditDTO> getCredit(@PathVariable Long id) {
        return creditService.getCreditById(id)
                .map(credit -> ResponseEntity.ok(credit))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CreditDTO> updateCredit(@PathVariable Long id, @RequestBody CreditDTO creditDetails) {
        return ResponseEntity.ok(creditService.updateCredit(id, creditDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredit(@PathVariable Long id) {
        creditService.deleteCredit(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Endpoint to send WhatsApp notification for a credit
    @PostMapping("/{customerId}/whatsapp/{creditId}")
    public String sendWhatsAppNotification(
            @PathVariable("customerId") Long customerId,
            @PathVariable("creditId") Long creditId) {

        // Get the customer phone number and credit details
        String phoneNumber = creditService.getCustomerPhoneNumber(customerId); // Implement this method
        String message = creditService.getCreditDescription(creditId,customerId); // Implement this method

        // Send WhatsApp notification

        //whatsAppService.sendWhatsAppMessage(phoneNumber, message);

        return "WhatsApp notification sent successfully!";
    }
}
