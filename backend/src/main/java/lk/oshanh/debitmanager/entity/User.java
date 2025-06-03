package lk.oshanh.debitmanager.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data  // Lombok annotation to generate getters, setters, toString, equals, hashCode methods
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uid;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = true, unique = true)
    private String email;

    @Column(nullable = true)
    private String password;

    private String address;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = true)
    private boolean emailVerified = false;
}
