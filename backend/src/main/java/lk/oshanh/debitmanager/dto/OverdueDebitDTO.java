package lk.oshanh.debitmanager.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class OverdueDebitDTO {
    private Long id;
    private String debtorName;
    private Double debitAmount;
    private Double totalRepayments;
    private LocalDate dueDate;
    private String description;
    private Long debtorId;
    private Long daysOverdue;
} 