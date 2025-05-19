package lk.oshanh.crediManage.repository;

import lk.oshanh.crediManage.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // You can define custom queries here if needed
    Customer findCustomerById(Long Id);

    List<Customer> findCustomersByUser_Uid(Long userUid);
}
