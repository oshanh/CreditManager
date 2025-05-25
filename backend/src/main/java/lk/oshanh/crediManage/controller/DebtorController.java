package lk.oshanh.credimanage.controller;

import lk.oshanh.credimanage.dto.DebtorDTO;
import lk.oshanh.credimanage.security.SecurityUtils;
import lk.oshanh.credimanage.service.DebtorService;
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

    private final DebtorService debtorService;
    private final SecurityUtils securityUtils;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DebtorDTO> createDebtor(
            @RequestPart("debtor") DebtorDTO debtorDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        DebtorDTO created = debtorService.createDebtor(debtorDTO, file, userId);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<DebtorDTO>> getAllDebtors() {
        System.out.println("\ninside Controller\nCurrent user ID: " + securityUtils.getCurrentUserId()+"\n");
        Long userId = securityUtils.getCurrentUserId();

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<DebtorDTO> debtorDTOS = debtorService.getDebtorsByUserId(userId);
        return ResponseEntity.ok(debtorDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DebtorDTO> getDebtor(@PathVariable Long id) {
        return debtorService.getDebtorById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DebtorDTO> updateDebtor(
            @PathVariable Long id,
            @RequestPart("debtor") DebtorDTO debtorDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return debtorService.updateDebtor(id, debtorDTO, file, userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
