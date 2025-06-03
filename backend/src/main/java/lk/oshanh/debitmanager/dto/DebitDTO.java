package lk.oshanh.debitmanager.dto;

import lk.oshanh.debitmanager.entity.Debit.DebitType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DebitDTO {
    private Long id;
    private Double debitAmount;
    private String description;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private DebitType type;
    private Long debtorId;
    private Double totalRepayments;
}
