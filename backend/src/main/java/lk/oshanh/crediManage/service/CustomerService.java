package lk.oshanh.crediManage.service;

import lk.oshanh.crediManage.dto.CustomerDTO;
import lk.oshanh.crediManage.entity.Customer;
import lk.oshanh.crediManage.entity.User;
import lk.oshanh.crediManage.mapper.CustomerMapper;
import lk.oshanh.crediManage.repository.CustomerRepository;
import lk.oshanh.crediManage.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomerService {


    private final CustomerRepository customerRepository;

    private final UserRepository userRepository;

    public CustomerService(CustomerRepository customerRepository, UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;

    }

    // Create a new customer
    public CustomerDTO createCustomer(CustomerDTO customerDTO, MultipartFile file,Long userId) {
        User user = userRepository.findById(String.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Customer customer = CustomerMapper.toEntity(customerDTO);
        customer.setUser(user);

        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "uploads/customers";
                Files.createDirectories(Paths.get(uploadDir));

                String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.copy(file.getInputStream(), filePath);

                // Save relative path
                customer.setProfilePhotoPath("/uploads/customers/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image", e);
            }
        }

        customer = customerRepository.saveAndFlush(customer);
        return CustomerMapper.toDTO(customer);
    }


    // Get all customers
    public List<CustomerDTO> getCustomersByUserId(Long userId) {
    System.out.println("Retrieving customers for user ID: " + userId);
    List<Customer> customers = customerRepository.findCustomersByUser_Uid(userId);
    System.out.println("Found " + customers.size() + " customers for user ID: " + userId);
    return customers.stream()
            .map(CustomerMapper::toDTO)
            //.peek(dto -> System.out.println("Mapped customer to DTO: " + dto))
            .collect(Collectors.toList());
}

public List<CustomerDTO> getCustomersByUserId1(Long userId) {
        return customerRepository.findCustomersByUser_Uid(userId)
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
