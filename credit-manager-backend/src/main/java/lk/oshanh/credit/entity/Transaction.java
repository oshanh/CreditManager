package lk.oshanh.credit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private TransactionType type;
    private double amount;
    private String description;
    private String date;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;


}

enum TransactionType {
    CREDIT, DEBIT
}
