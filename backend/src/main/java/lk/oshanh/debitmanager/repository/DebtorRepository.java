package lk.oshanh.debitmanager.repository;

import lk.oshanh.debitmanager.entity.Debtor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DebtorRepository extends JpaRepository<Debtor, Long> {
    // You can define custom queries here if needed
    Debtor findDebtorById(Long Id);

    List<Debtor> findDebtorsByUser_Uid(Long userUid);
}
