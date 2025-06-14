package lk.oshanh.debitmanager.repository;

import lk.oshanh.debitmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByAddress(String address);
    boolean existsByEmail(String email);
    boolean existsByAddress(String address);
}
