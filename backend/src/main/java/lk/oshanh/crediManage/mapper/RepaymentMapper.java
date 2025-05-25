package lk.oshanh.credimanage.mapper;

import lk.oshanh.credimanage.entity.Repayment;
import lk.oshanh.credimanage.dto.RepaymentDTO;

public class RepaymentMapper {

    public static RepaymentDTO toDTO(Repayment repayment) {
        RepaymentDTO dto = new RepaymentDTO();
        dto.setId(repayment.getId());
        dto.setRepaymentAmount(repayment.getRepaymentAmount());
        dto.setRepaymentDate(repayment.getRepaymentDate());
        dto.setCreditId(repayment.getCredit().getId());  // Mapping the credit ID
        return dto;
    }

    public static Repayment toEntity(RepaymentDTO dto) {
        Repayment repayment = new Repayment();
        repayment.setId(dto.getId());
        repayment.setRepaymentAmount(dto.getRepaymentAmount());
        repayment.setRepaymentDate(dto.getRepaymentDate());
        return repayment;
    }
}
