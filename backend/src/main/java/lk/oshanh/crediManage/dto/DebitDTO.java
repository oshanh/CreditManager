package lk.oshanh.credimanage.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DebitDTO {
    private Long id;
    private Double debitAmount;
    private String description;
    private LocalDate dueDate;
    private Long debtorId;
}
