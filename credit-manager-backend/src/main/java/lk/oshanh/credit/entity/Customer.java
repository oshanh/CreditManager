package lk.oshanh.credit.entity;

import jakarta.persistence.Entity;  // Updated import for Jakarta Persistence
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;  // Use jakarta.persistence for JPA annotations
import java.util.List;

@Entity
@Data  // Lombok annotation to generate getters, setters, toString, equals, hashCode methods
@NoArgsConstructor  // Lombok annotation to generate a no-args constructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String contactNumber;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Credit> credits;
}
