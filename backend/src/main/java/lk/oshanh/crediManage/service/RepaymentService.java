package lk.oshanh.credimanage.service;

import lk.oshanh.credimanage.dto.RepaymentDTO;
import lk.oshanh.credimanage.entity.Repayment;
import lk.oshanh.credimanage.entity.Debit;
import lk.oshanh.credimanage.mapper.RepaymentMapper;
import lk.oshanh.credimanage.repository.DebtorRepository;
import lk.oshanh.credimanage.repository.RepaymentRepository;
import lk.oshanh.credimanage.repository.DebitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepaymentService {

    @Autowired
    private RepaymentRepository repaymentRepository;

    @Autowired
    private DebitRepository debitRepository;

    @Autowired
    private DebtorRepository debtorRepository;

    // Add repayment for a debit
    public RepaymentDTO addRepayment(Long debitId, RepaymentDTO repaymentDTO) {
        Repayment repayment = RepaymentMapper.toEntity(repaymentDTO);
        repayment.setPaid(true);
        repayment.setDebit(debitRepository.findById(debitId).orElseThrow());
        repayment = repaymentRepository.save(repayment);
        return RepaymentMapper.toDTO(repayment);
    }

    // Get repayments for a specific debit
    public List<RepaymentDTO> getRepaymentsForDebit(Long debitId) {
        return repaymentRepository.findByDebitId(debitId)
                .stream()
                .map(RepaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Update repayment
    public RepaymentDTO updateRepayment(Long id, RepaymentDTO repaymentDTO) {
        Repayment existingRepayment = repaymentRepository.findById(id).orElseThrow();
        existingRepayment.setRepaymentAmount(repaymentDTO.getRepaymentAmount());
        existingRepayment.setRepaymentDate(repaymentDTO.getRepaymentDate());
        existingRepayment = repaymentRepository.save(existingRepayment);
        return RepaymentMapper.toDTO(existingRepayment);
    }

    // Mark repayment as paid
    @Transactional
    public RepaymentDTO markAsPaid(Long id) {
        Repayment repayment = repaymentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Repayment not found"));
        
        if (repayment.isPaid()) {
            throw new IllegalArgumentException("Repayment is already marked as paid");
        }
        
        repayment.setPaid(true);
        repayment = repaymentRepository.save(repayment);
        
        // Update total repayments in the debit
        Debit debit = repayment.getDebit();
        double currentTotal = debit.getTotalRepayments() != null ? debit.getTotalRepayments() : 0.0;
        debit.setTotalRepayments(currentTotal + repayment.getRepaymentAmount());
        debitRepository.save(debit);

        // Update debtor's total balance
        debit.getDebtor().setTotalBalance(debit.getDebtor().getTotalBalance() - repayment.getRepaymentAmount());
        debtorRepository.save(debit.getDebtor());
        
        return RepaymentMapper.toDTO(repayment);
    }

    // Undo payment status
    @Transactional
    public RepaymentDTO undoPayment(Long id) {
        Repayment repayment = repaymentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Repayment not found"));
        
        if (!repayment.isPaid()) {
            throw new IllegalArgumentException("Repayment is not marked as paid");
        }
        
        repayment.setPaid(false);
        repayment = repaymentRepository.save(repayment);
        
        // Update total repayments in the debit
        Debit debit = repayment.getDebit();
        double currentTotal = debit.getTotalRepayments() != null ? debit.getTotalRepayments() : 0.0;
        debit.setTotalRepayments(currentTotal - repayment.getRepaymentAmount());
        debitRepository.save(debit);
        
        return RepaymentMapper.toDTO(repayment);
    }

    // Delete repayment
    public void deleteRepayment(Long id) {
        repaymentRepository.deleteById(id);
    }
}
