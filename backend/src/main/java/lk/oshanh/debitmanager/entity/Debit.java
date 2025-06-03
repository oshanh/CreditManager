package lk.oshanh.debitmanager.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data  // Lombok annotation to generate getters, setters, toString, equals, hashCode methods
@NoArgsConstructor  // Lombok annotation to generate a no-args constructor
public class Debit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "debtor_id", nullable = false)
    private Debtor debtor;  // This is the reference to the debtor entity

    @Column(nullable = false)
    private Double debitAmount;

    @Column(nullable = false)
    private LocalDate issueDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DebitType type;

    @Column
    private String description;

    @Column(nullable = false)
    private Double totalRepayments = 0.0;

    @OneToMany(mappedBy = "debit", cascade = CascadeType.ALL)
    private List<Repayment> repayments;  // List of repayments related to this debit

    public enum DebitType {
        DAILY,
        WEEKLY,
        MONTHLY
    }
}
