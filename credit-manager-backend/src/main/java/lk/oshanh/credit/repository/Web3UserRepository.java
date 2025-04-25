package lk.oshanh.credit.repository;

import lk.oshanh.credit.entity.Web3User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Web3UserRepository extends JpaRepository<Web3User, String> {
}
