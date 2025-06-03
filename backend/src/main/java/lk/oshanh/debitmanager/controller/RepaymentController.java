package lk.oshanh.debitmanager.controller;

import lk.oshanh.debitmanager.dto.RepaymentDTO;
import lk.oshanh.debitmanager.service.RepaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/repayments")
public class RepaymentController {

    @Autowired
    private RepaymentService repaymentService;

    @PostMapping("/{debitId}")
    public ResponseEntity<RepaymentDTO> createRepayment(
            @PathVariable Long debitId,
            @Valid @RequestBody RepaymentDTO repaymentDTO) {
        try {
            RepaymentDTO createdRepayment = repaymentService.addRepayment(debitId, repaymentDTO);
            return new ResponseEntity<>(createdRepayment, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{debitId}")
    public ResponseEntity<List<RepaymentDTO>> getRepaymentsForDebit(@PathVariable Long debitId) {
        try {
            List<RepaymentDTO> repayments = repaymentService.getRepaymentsForDebit(debitId);
            return ResponseEntity.ok(repayments);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepaymentDTO> updateRepayment(
            @PathVariable Long id,
            @Valid @RequestBody RepaymentDTO repaymentDTO) {
        try {
            RepaymentDTO updatedRepayment = repaymentService.updateRepayment(id, repaymentDTO);
            return ResponseEntity.ok(updatedRepayment);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/mark-as-paid")
    public ResponseEntity<RepaymentDTO> markAsPaid(@PathVariable Long id) {
        try {
            RepaymentDTO updatedRepayment = repaymentService.markAsPaid(id);
            return ResponseEntity.ok(updatedRepayment);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/undo-payment")
    public ResponseEntity<RepaymentDTO> undoPayment(@PathVariable Long id) {
        try {
            RepaymentDTO updatedRepayment = repaymentService.undoPayment(id);
            return ResponseEntity.ok(updatedRepayment);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepayment(@PathVariable Long id) {
        try {
            repaymentService.deleteRepayment(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
