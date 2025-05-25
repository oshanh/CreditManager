package lk.oshanh.credimanage.repository;

import lk.oshanh.credimanage.entity.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditRepository extends JpaRepository<Credit, Long> {
    // You can define custom queries here if needed
    Credit findCreditById(long id);
}
