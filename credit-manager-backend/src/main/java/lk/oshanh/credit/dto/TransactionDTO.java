package lk.oshanh.credit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {
    private Long id;
    private TransactionType type;
    private double amount;
    private String description;
    private String date;
}

// Proper enum definition
enum TransactionType {
    CREDIT, DEBIT
}
