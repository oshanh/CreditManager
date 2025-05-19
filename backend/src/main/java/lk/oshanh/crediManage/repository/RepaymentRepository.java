package lk.oshanh.crediManage.repository;

import lk.oshanh.crediManage.entity.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    // Custom query to get repayments by credit ID
    List<Repayment> findByCreditId(Long creditId);
}
