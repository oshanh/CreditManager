package lk.oshanh.credit.repository;

import lk.oshanh.credit.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // You can define custom queries here if needed
    Customer findCustomerById(Long Id);
}
