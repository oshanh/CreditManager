package lk.oshanh.credit.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data  // Lombok annotation to generate getters, setters, toString, equals, hashCode methods
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    private String address; // Ethereum address as the unique ID

    private String nickname;
    private LocalDateTime createdAt;
}
