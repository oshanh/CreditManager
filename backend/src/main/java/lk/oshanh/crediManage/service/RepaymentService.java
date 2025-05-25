package lk.oshanh.credimanage.service;

import lk.oshanh.credimanage.dto.RepaymentDTO;
import lk.oshanh.credimanage.entity.Repayment;
import lk.oshanh.credimanage.mapper.RepaymentMapper;
import lk.oshanh.credimanage.repository.RepaymentRepository;
import lk.oshanh.credimanage.repository.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepaymentService {

    @Autowired
    private RepaymentRepository repaymentRepository;

    @Autowired
    private CreditRepository creditRepository;

    // Add repayment for a credit
    public RepaymentDTO addRepayment(Long creditId, RepaymentDTO repaymentDTO) {
        Repayment repayment = RepaymentMapper.toEntity(repaymentDTO);
        repayment.setCredit(creditRepository.findById(creditId).orElseThrow());
        repayment = repaymentRepository.save(repayment);
        return RepaymentMapper.toDTO(repayment);
    }

    // Get repayments for a specific credit
    public List<RepaymentDTO> getRepaymentsForCredit(Long creditId) {
        return repaymentRepository.findByCreditId(creditId)
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
