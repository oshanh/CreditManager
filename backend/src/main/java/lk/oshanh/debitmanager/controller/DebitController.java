package lk.oshanh.debitmanager.controller;

import lk.oshanh.debitmanager.dto.DebitDTO;
import lk.oshanh.debitmanager.dto.OverdueDebitDTO;
import lk.oshanh.debitmanager.service.DebitService;
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
    public ResponseEntity<?> createDebit(@RequestBody DebitDTO debitDTO) {
        try {
            DebitDTO createdDebit = debitService.createDebit(debitDTO);
            return new ResponseEntity<>(createdDebit, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<DebitDTO>> getAllDebits() {
        List<DebitDTO> debits = debitService.getAllDebits();
        return ResponseEntity.ok(debits);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDebit(@PathVariable Long id) {
        try {
            return debitService.getDebitById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/debtor/{debtorId}")
    public ResponseEntity<?> getDebitsByDebtorId(@PathVariable Long debtorId) {
        try {
            List<DebitDTO> debits = debitService.getDebitsByDebtorId(debtorId);
            return ResponseEntity.ok(debits);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDebit(@PathVariable Long id, @RequestBody DebitDTO debitDetails) {
        try {
            DebitDTO updatedDebit = debitService.updateDebit(id, debitDetails);
            return ResponseEntity.ok(updatedDebit);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDebit(@PathVariable Long id) {
        try {
            debitService.deleteDebit(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<OverdueDebitDTO>> getOverdueDebits() {
        List<OverdueDebitDTO> overdueDebits = debitService.getOverdueDebits();
        return ResponseEntity.ok(overdueDebits);
    }
}
