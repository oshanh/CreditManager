package lk.oshanh.crediManage.controller;

import lk.oshanh.crediManage.dto.CustomerDTO;
import lk.oshanh.crediManage.security.SecurityUtils;
import lk.oshanh.crediManage.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/debtors")
@RequiredArgsConstructor
public class DebtorController {

    private final CustomerService customerService;
    private final SecurityUtils securityUtils;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomerDTO> createDebtor(
            @RequestPart("debtor") CustomerDTO customerDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomerDTO created = customerService.createCustomer(customerDTO, file, userId);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllDebtors() {
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<CustomerDTO> customerDTOS = customerService.getCustomersByUserId(userId);
        return ResponseEntity.ok(customerDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
