package lk.oshanh.debitmanager.mapper;

import lk.oshanh.debitmanager.entity.Repayment;
import lk.oshanh.debitmanager.dto.RepaymentDTO;

public class RepaymentMapper {

    public static RepaymentDTO toDTO(Repayment repayment) {
        RepaymentDTO dto = new RepaymentDTO();
        dto.setId(repayment.getId());
        dto.setRepaymentAmount(repayment.getRepaymentAmount());
        dto.setRepaymentDate(repayment.getRepaymentDate());
        dto.setPaid(repayment.isPaid());
        dto.setDebitId(repayment.getDebit().getId());  // Mapping the debit ID
        return dto;
    }

    public static Repayment toEntity(RepaymentDTO dto) {
        Repayment repayment = new Repayment();
        repayment.setId(dto.getId());
        repayment.setRepaymentAmount(dto.getRepaymentAmount());
        repayment.setRepaymentDate(dto.getRepaymentDate());
        repayment.setPaid(dto.isPaid());
        return repayment;
    }
}
