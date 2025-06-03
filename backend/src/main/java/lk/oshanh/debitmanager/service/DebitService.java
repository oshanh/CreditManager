package lk.oshanh.debitmanager.service;

import jakarta.transaction.Transactional;
import lk.oshanh.debitmanager.dto.DebitDTO;
import lk.oshanh.debitmanager.entity.Debit;
import lk.oshanh.debitmanager.entity.Debtor;
import lk.oshanh.debitmanager.entity.Repayment;
import lk.oshanh.debitmanager.mapper.DebitMapper;
import lk.oshanh.debitmanager.mapper.DebtorMapper;
import lk.oshanh.debitmanager.repository.DebitRepository;
import lk.oshanh.debitmanager.repository.DebtorRepository;
import lk.oshanh.debitmanager.repository.RepaymentRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DebitService {

    private final DebitRepository debitRepository;
    private final DebtorRepository debtorRepository;
    private final RepaymentRepository repaymentRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final DebtorMapper debtorMapper = new DebtorMapper();

    public DebitService(DebitRepository debitRepository, DebtorRepository debtorRepository, RepaymentRepository repaymentRepository, SimpMessagingTemplate messagingTemplate) {
        this.debitRepository = debitRepository;
        this.debtorRepository = debtorRepository;
        this.repaymentRepository = repaymentRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public DebitDTO createDebit(DebitDTO debitDTO) {
        // Validate required fields
        if (debitDTO.getDebitAmount() == null || debitDTO.getDebitAmount() <= 0) {
            throw new IllegalArgumentException("Debit amount must be greater than 0");
        }
        if (debitDTO.getIssueDate() == null) {
            debitDTO.setIssueDate(LocalDate.now());
        }
        if (debitDTO.getDueDate() == null || debitDTO.getDueDate().isBefore(debitDTO.getIssueDate())) {
            throw new IllegalArgumentException("Due date must be after issue date");
        }
        if (debitDTO.getType() == null) {
            throw new IllegalArgumentException("Debit type is required");
        }

        // Fetch debtor
        Debtor debtor = debtorRepository.findById(debitDTO.getDebtorId())
            .orElseThrow(() -> new IllegalArgumentException("Debtor not found"));

        // Convert and save debit
        Debit debit = DebitMapper.toEntity(debitDTO);
        debit.setDebtor(debtor);
        debit = debitRepository.save(debit);

        // Generate repayment schedule
        generateRepaymentSchedule(debit.getId());

        //update debtor's total balance
        debtor.setTotalBalance(debtor.getTotalBalance()+debit.getDebitAmount());
        debtorRepository.save(debtor);

        // Notify through WebSocket
        messagingTemplate.convertAndSend("/topic/debit", "New debit added: " + debit.getDebitAmount());

        return DebitMapper.toDTO(debit);
    }

    public List<DebitDTO> getAllDebits() {
        return debitRepository.findAll()
                .stream()
                .map(DebitMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<DebitDTO> getDebitById(Long id) {
        return debitRepository.findById(id)
                .map(DebitMapper::toDTO);
    }

    @Transactional
    public DebitDTO updateDebit(Long id, DebitDTO debitDTO) {
        Debit existingDebit = debitRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Debit not found"));

        // Validate dates
        if (debitDTO.getDueDate() != null && debitDTO.getDueDate().isBefore(existingDebit.getIssueDate())) {
            throw new IllegalArgumentException("Due date must be after issue date");
        }

        // Update fields
        if (debitDTO.getDebitAmount() != null) {
            existingDebit.setDebitAmount(debitDTO.getDebitAmount());
        }
        if (debitDTO.getDescription() != null) {
            existingDebit.setDescription(debitDTO.getDescription());
        }
        if (debitDTO.getDueDate() != null) {
            existingDebit.setDueDate(debitDTO.getDueDate());
        }
        if (debitDTO.getType() != null) {
            existingDebit.setType(debitDTO.getType());
        }

        existingDebit = debitRepository.save(existingDebit);
        return DebitMapper.toDTO(existingDebit);
    }

    public void deleteDebit(Long id) {
        if (!debitRepository.existsById(id)) {
            throw new IllegalArgumentException("Debit not found");
        }
        debitRepository.deleteById(id);
    }

    public List<DebitDTO> getDebitsByDebtorId(Long debtorId) {
        return debitRepository.findByDebtorId(debtorId)
                .stream()
                .map(DebitMapper::toDTO)
                .collect(Collectors.toList());
    }

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

    @Transactional
    public void generateRepaymentSchedule(Long debitId) {
        Debit debit = debitRepository.findById(debitId)
            .orElseThrow(() -> new IllegalArgumentException("Debit not found"));

        LocalDate startDate = debit.getIssueDate();
        LocalDate endDate = debit.getDueDate();
        double totalAmount = debit.getDebitAmount();
        
        // Calculate number of payments based on type
        long numberOfPayments;
        switch (debit.getType()) {
            case DAILY:
                numberOfPayments = ChronoUnit.DAYS.between(startDate, endDate) + 1;
                break;
            case WEEKLY:
                numberOfPayments = ChronoUnit.WEEKS.between(startDate, endDate) + 1;
                break;
            case MONTHLY:
                numberOfPayments = ChronoUnit.MONTHS.between(startDate, endDate) + 1;
                break;
            default:
                throw new IllegalArgumentException("Invalid debit type");
        }

        // Calculate payment amount per installment
        double paymentPerInstallment = totalAmount / numberOfPayments;

        // Generate repayment records
        LocalDate currentDate = startDate;
        for (int i = 0; i < numberOfPayments; i++) {
            Repayment repayment = new Repayment();
            repayment.setDebit(debit);
            repayment.setRepaymentAmount(paymentPerInstallment);
            repayment.setRepaymentDate(currentDate);
            repayment.setPaid(false);
            repaymentRepository.save(repayment);

            // Increment date based on type
            switch (debit.getType()) {
                case DAILY:
                    currentDate = currentDate.plusDays(1);
                    break;
                case WEEKLY:
                    currentDate = currentDate.plusWeeks(1);
                    break;
                case MONTHLY:
                    currentDate = currentDate.plusMonths(1);
                    break;
            }
        }
    }
}
