package lk.oshanh.debitmanager.entity;

import jakarta.persistence.Entity;  // Updated import for Jakarta Persistence
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;  // Use jakarta.persistence for JPA annotations

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data  // Lombok annotation to generate getters, setters, toString, equals, hashCode methods
@NoArgsConstructor  // Lombok annotation to generate a no-args constructor
public class Debtor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String debtorName;
    private String contactNumber;
    private String address;
    private String profilePhotoPath;

    private double totalBalance=0.0;
    private String email;

    @OneToMany(mappedBy = "debtor", cascade = CascadeType.ALL)
    private List<Debit> debits;

    @OneToMany(mappedBy = "debtor" , cascade = CascadeType.ALL)
    private List<Transaction> transactions;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();
}
