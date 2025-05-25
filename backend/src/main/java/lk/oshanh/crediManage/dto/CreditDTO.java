package lk.oshanh.credimanage.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreditDTO {
    private Long id;
    private Double creditAmount;
    private String description;
    private LocalDate dueDate;
    private Long debtorId;
}
