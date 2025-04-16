package lk.oshanh.credit.service;

import jakarta.transaction.Transactional;
import lk.oshanh.credit.dto.CreditDTO;
import lk.oshanh.credit.dto.CustomerDTO;
import lk.oshanh.credit.entity.Credit;
import lk.oshanh.credit.entity.Customer;
import lk.oshanh.credit.mapper.CreditMapper;
import lk.oshanh.credit.mapper.CustomerMapper;
import lk.oshanh.credit.repository.CreditRepository;
import lk.oshanh.credit.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CreditService {

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private  SimpMessagingTemplate messagingTemplate;


    private CustomerMapper customerMapper=new CustomerMapper();

    // Create credit for a customer
    @Transactional
    public CreditDTO createCredit(CreditDTO creditDTO) {
        // Fetch customer by ID (without custom exception handling)
        Customer customer = customerRepository.findById(creditDTO.getCustomerId()).orElse(null);

        if (customer == null) {
            // If customer not found, return null or handle appropriately (like returning a message)
            return null;  // You can adjust this behavior based on your needs
        }

        // Convert CreditDTO to Credit entity
        Credit credit = CreditMapper.toEntity(creditDTO);
        credit.setCustomer(customer);  // Set the customer in the credit object

        // Save the credit entity
        credit = creditRepository.save(credit);
        messagingTemplate.convertAndSend("/topic/credit", "New credit added: " + credit.getCreditAmount());


        return CreditMapper.toDTO(credit);  // Return the DTO
    }


    // Get all credits
    public List<CreditDTO> getAllCredits() {
        return creditRepository.findAll()
                .stream()
                .map(CreditMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get credit by ID
    public Optional<CreditDTO> getCreditById(Long id) {
        return creditRepository.findById(id)
                .map(CreditMapper::toDTO);
    }

    // Update credit
    public CreditDTO updateCredit(Long id, CreditDTO creditDTO) {
        Credit existingCredit = creditRepository.findById(id).orElseThrow();
        existingCredit.setCreditAmount(creditDTO.getCreditAmount());
        existingCredit.setDescription(creditDTO.getDescription());
        existingCredit.setDueDate(creditDTO.getDueDate());
        existingCredit = creditRepository.save(existingCredit);
        return CreditMapper.toDTO(existingCredit);
    }

    // Delete credit
    public void deleteCredit(Long id) {
        creditRepository.deleteById(id);
    }


//    public String getCustomerPhoneNumber(Long customerId) {
//        Optional<Customer> customer=customerRepository.findById(customerId);
//        CustomerDTO customerDTO=CustomerMapper.toDTO(customer);
//
//        //return customerDTO.getContactNumber();
//
//    }
public String getCustomerPhoneNumber(Long customerId) {
    Customer customer=customerRepository.findCustomerById(customerId);
    System.out.println("\n CN : "+customer.getContactNumber()+"\n");
    // This is a dummy implementation, replace with actual logic to get customer phone
    return customer.getContactNumber();  // Replace with the customer's phone number
}

    // Get credit description by creditId (implement based on your DB structure)
    public String getCreditDescription(Long creditId,Long customerId) {
        // This is a dummy implementation, replace with actual logic to get credit description
        Credit credit=creditRepository.findCreditById(creditId);
        Customer customer=customerRepository.findCustomerById(customerId);
        String msg="Dear "+customer.getCustomerName() +",\n"
                    +"You have to pay Rs." +credit.getCreditAmount() +"\n Before "
                    +credit.getDueDate();
        System.out.println(msg);
        return msg;  // Replace with the actual credit description
    }

}
