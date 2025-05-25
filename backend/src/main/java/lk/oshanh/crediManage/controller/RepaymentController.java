package lk.oshanh.credimanage.controller;

import lk.oshanh.credimanage.dto.RepaymentDTO;
import lk.oshanh.credimanage.service.RepaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/repayments")

public class RepaymentController {

    @Autowired
    private RepaymentService repaymentService;

    @PostMapping("/{creditId}")
    public ResponseEntity<RepaymentDTO> createRepayment(@PathVariable Long creditId, @RequestBody RepaymentDTO repaymentDTO) {
        RepaymentDTO createdRepayment = repaymentService.addRepayment(creditId, repaymentDTO);
        return new ResponseEntity<>(createdRepayment, HttpStatus.CREATED);
    }

    @GetMapping("/{creditId}")
    public List<RepaymentDTO> getRepaymentsForCredit(@PathVariable Long creditId) {
        return repaymentService.getRepaymentsForCredit(creditId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepaymentDTO> updateRepayment(@PathVariable Long id, @RequestBody RepaymentDTO repaymentDTO) {
        return ResponseEntity.ok(repaymentService.updateRepayment(id, repaymentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepayment(@PathVariable Long id) {
        repaymentService.deleteRepayment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
