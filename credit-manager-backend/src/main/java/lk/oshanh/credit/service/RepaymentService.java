package lk.oshanh.credit.service;

import lk.oshanh.credit.dto.RepaymentDTO;
import lk.oshanh.credit.entity.Repayment;
import lk.oshanh.credit.mapper.RepaymentMapper;
import lk.oshanh.credit.repository.RepaymentRepository;
import lk.oshanh.credit.repository.CreditRepository;
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
