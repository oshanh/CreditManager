package lk.oshanh.credit.service;

import lk.oshanh.credit.dto.CustomerDTO;
import lk.oshanh.credit.entity.Customer;
import lk.oshanh.credit.mapper.CustomerMapper;
import lk.oshanh.credit.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Create a new customer
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = CustomerMapper.toEntity(customerDTO);
        customer = customerRepository.save(customer);
        return CustomerMapper.toDTO(customer);
    }

    // Get all customers
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get customer by ID
    public Optional<CustomerDTO> getCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(CustomerMapper::toDTO);
    }

    // Update customer
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer existingCustomer = customerRepository.findById(id).orElseThrow();
        existingCustomer.setCustomerName(customerDTO.getCustomerName());
        existingCustomer.setContactNumber(customerDTO.getContactNumber());
        existingCustomer = customerRepository.save(existingCustomer);
        return CustomerMapper.toDTO(existingCustomer);
    }

    // Delete customer
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
