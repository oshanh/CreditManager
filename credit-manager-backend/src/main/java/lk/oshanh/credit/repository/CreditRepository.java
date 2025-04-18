package lk.oshanh.credit.repository;

import lk.oshanh.credit.entity.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditRepository extends JpaRepository<Credit, Long> {
    // You can define custom queries here if needed
    Credit findCreditById(long id);
}
