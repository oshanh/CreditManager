package lk.oshanh.credimanage.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Data  // Lombok annotation to generate getters, setters, toString, equals, hashCode methods
@NoArgsConstructor  // Lombok annotation to generate a no-args constructor
public class Repayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double repaymentAmount;
    private LocalDate repaymentDate;

    @ManyToOne
    @JoinColumn(name = "debit_id")
    private Debit debit;  // Reference to the debit entity for which the repayment is made
}
