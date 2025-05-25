package lk.oshanh.credimanage.service;

import lk.oshanh.credimanage.dto.RepaymentDTO;
import lk.oshanh.credimanage.entity.Repayment;
import lk.oshanh.credimanage.mapper.RepaymentMapper;
import lk.oshanh.credimanage.repository.RepaymentRepository;
import lk.oshanh.credimanage.repository.DebitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepaymentService {

    @Autowired
    private RepaymentRepository repaymentRepository;

    @Autowired
    private DebitRepository debitRepository;

    // Add repayment for a debit
    public RepaymentDTO addRepayment(Long debitId, RepaymentDTO repaymentDTO) {
        Repayment repayment = RepaymentMapper.toEntity(repaymentDTO);
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

    // Delete repayment
    public void deleteRepayment(Long id) {
        repaymentRepository.deleteById(id);
    }
}
