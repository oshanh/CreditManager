package lk.oshanh.crediManage.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RepaymentDTO {
    private Long id;
    private Double repaymentAmount;
    private LocalDate repaymentDate;
    private Long creditId;  // Foreign key for Credit
}
