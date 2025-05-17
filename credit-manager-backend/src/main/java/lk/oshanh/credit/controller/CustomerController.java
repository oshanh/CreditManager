package lk.oshanh.credit.controller;

import jakarta.servlet.http.HttpSession;
import lk.oshanh.credit.dto.CustomerDTO;
import lk.oshanh.credit.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")

public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomerDTO> createCustomer(
            @RequestPart("customer") CustomerDTO customerDTO,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        System.out.println("\ngetting userId : " + session.getAttribute("userId") + "\n");

        if (userId == null) {
            System.out.println("\nUserId is Null \n");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomerDTO created = customerService.createCustomer(customerDTO, file, userId);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers(HttpSession session) {
        Long userId=(Long) session.getAttribute("userId");
        if(userId==null) {
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<CustomerDTO> customerDTOS= customerService.getCustomersByUserId(userId);
        return ResponseEntity.ok(customerDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDetails) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customerDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
