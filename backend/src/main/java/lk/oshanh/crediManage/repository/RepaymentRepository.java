package lk.oshanh.credimanage.repository;

import lk.oshanh.credimanage.entity.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    // Custom query to get repayments by debit ID
    List<Repayment> findByDebitId(Long debitId);
}
