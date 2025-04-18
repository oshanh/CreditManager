package lk.oshanh.credit.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreditDTO {
    private Long id;
    private Double creditAmount;
    private String description;
    private LocalDate dueDate;
    private Long customerId;  // Foreign key for Customer
}
