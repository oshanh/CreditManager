package lk.oshanh.crediManage.entity;

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
    @JoinColumn(name = "credit_id")
    private Credit credit;  // Reference to the Credit entity for which the repayment is made
}
