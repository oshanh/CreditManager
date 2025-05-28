package lk.oshanh.credimanage.repository;

import lk.oshanh.credimanage.entity.Debit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DebitRepository extends JpaRepository<Debit, Long> {
    // You can define custom queries here if needed
    Debit findDebitById(long id);
    List<Debit> findByDebtorId(Long debtorId);
}
