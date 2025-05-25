package lk.oshanh.credimanage.service;

import jakarta.transaction.Transactional;
import lk.oshanh.credimanage.dto.DebitDTO;
import lk.oshanh.credimanage.entity.Debit;
import lk.oshanh.credimanage.entity.Debtor;
import lk.oshanh.credimanage.mapper.DebitMapper;
import lk.oshanh.credimanage.mapper.DebtorMapper;
import lk.oshanh.credimanage.repository.DebitRepository;
import lk.oshanh.credimanage.repository.DebtorRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DebitService {

    private final DebitRepository debitRepository;

    private final DebtorRepository debtorRepository;

    private final SimpMessagingTemplate messagingTemplate;


    private DebtorMapper debtorMapper =new DebtorMapper();

    public DebitService(DebitRepository debitRepository, DebtorRepository debtorRepository, SimpMessagingTemplate messagingTemplate) {
        this.debitRepository = debitRepository;
        this.debtorRepository = debtorRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // Create debit for a customer
    @Transactional
    public DebitDTO createDebit(DebitDTO debitDTO) {
        // Fetch customer by ID (without custom exception handling)
        Debtor debtor = debtorRepository.findById(debitDTO.getDebtorId()).orElse(null);

        if (debtor == null) {
            // If customer not found, return null or handle appropriately (like returning a message)
            return null;  // You can adjust this behavior based on your needs
        }

        // Convert DebitDTO to Debit entity
        Debit debit = DebitMapper.toEntity(debitDTO);
        debit.setDebtor(debtor);  // Set the customer in the debit object

        // Save the debit entity
        debit = debitRepository.save(debit);
        messagingTemplate.convertAndSend("/topic/debit", "New debit added: " + debit.getDebitAmount());


        return DebitMapper.toDTO(debit);  // Return the DTO
    }


    // Get all debits
    public List<DebitDTO> getAllDebits() {
        return debitRepository.findAll()
                .stream()
                .map(DebitMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get debit by ID
    public Optional<DebitDTO> getDebitById(Long id) {
        return debitRepository.findById(id)
                .map(DebitMapper::toDTO);
    }

    // Update debit
    public DebitDTO updateDebit(Long id, DebitDTO debitDTO) {
        Debit existingDebit = debitRepository.findById(id).orElseThrow();
        existingDebit.setDebitAmount(debitDTO.getDebitAmount());
        existingDebit.setDescription(debitDTO.getDescription());
        existingDebit.setDueDate(debitDTO.getDueDate());
        existingDebit = debitRepository.save(existingDebit);
        return DebitMapper.toDTO(existingDebit);
    }

    // Delete debit
    public void deleteDebit(Long id) {
        debitRepository.deleteById(id);
    }


//    public String getCustomerPhoneNumber(Long customerId) {
//        Optional<Customer> customer=customerRepository.findById(customerId);
//        CustomerDTO customerDTO=CustomerMapper.toDTO(customer);
//
//        //return customerDTO.getContactNumber();
//
//    }
public String getCustomerPhoneNumber(Long debtorId) {
    Debtor debtor = debtorRepository.findDebtorById(debtorId);
    System.out.println("\n CN : "+ debtor.getContactNumber()+"\n");
    // This is a dummy implementation, replace with actual logic to get customer phone
    return debtor.getContactNumber();  // Replace with the customer's phone number
}

    // Get debit description by debitId (implement based on your DB structure)
    public String getDebitDescription(Long debitId,Long debtorId) {
        // This is a dummy implementation, replace with actual logic to get debit description
        Debit debit=debitRepository.findDebitById(debitId);
        Debtor debtor = debtorRepository.findDebtorById(debtorId);
        String msg="Dear "+ debtor.getDebtorName() +",\n"
                    +"You have to pay Rs." +debit.getDebitAmount() +"\n Before "
                    +debit.getDueDate();
        System.out.println(msg);
        return msg;  // Replace with the actual debit description
    }

}
