package lk.oshanh.debitmanager.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RepaymentDTO {
    private Long id;
    private Double repaymentAmount;
    private LocalDate repaymentDate;
    private boolean isPaid;
    private Long debitId;  // Foreign key for Debit
}
