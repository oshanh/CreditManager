package lk.oshanh.crediManage.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data  // Lombok annotation to generate getters, setters, toString, equals, hashCode methods
@NoArgsConstructor  // Lombok annotation to generate a no-args constructor
public class Credit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double creditAmount;
    private String description;
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;  // This is the reference to the Customer entity

    @OneToMany(mappedBy = "credit", cascade = CascadeType.ALL)
    private List<Repayment> repayments;  // List of repayments related to this credit

}
