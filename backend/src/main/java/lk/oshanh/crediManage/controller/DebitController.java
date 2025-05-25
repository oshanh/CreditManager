package lk.oshanh.credimanage.controller;

import lk.oshanh.credimanage.dto.DebitDTO;
import lk.oshanh.credimanage.service.DebitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/debits")

public class DebitController {

    private final DebitService debitService;

    public DebitController(DebitService debitService) {
        this.debitService = debitService;
    }


    @PostMapping
    public ResponseEntity<DebitDTO> createDebit(@RequestBody DebitDTO debitDTO) {
        DebitDTO createdDebit = debitService.createDebit(debitDTO);
        return new ResponseEntity<>(createdDebit, HttpStatus.CREATED);
    }

    @GetMapping
    public List<DebitDTO> getAllDebits() {
        return debitService.getAllDebits();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DebitDTO> getDebit(@PathVariable Long id) {
        return debitService.getDebitById(id)
                .map(debit -> ResponseEntity.ok(debit))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DebitDTO> updateDebit(@PathVariable Long id, @RequestBody DebitDTO debitDetails) {
        return ResponseEntity.ok(debitService.updateDebit(id, debitDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebit(@PathVariable Long id) {
        debitService.deleteDebit(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
