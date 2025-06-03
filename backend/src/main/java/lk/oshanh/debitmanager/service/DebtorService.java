package lk.oshanh.debitmanager.service;

import lk.oshanh.debitmanager.dto.DebtorDTO;
import lk.oshanh.debitmanager.entity.Debtor;
import lk.oshanh.debitmanager.entity.User;
import lk.oshanh.debitmanager.mapper.DebtorMapper;
import lk.oshanh.debitmanager.repository.DebtorRepository;
import lk.oshanh.debitmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

@RequiredArgsConstructor
@Service
public class DebtorService {


    private final DebtorRepository debtorRepository;

    private final UserRepository userRepository;


    // Create a new debtor
    public DebtorDTO createDebtor(DebtorDTO debtorDTO, MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Debtor debtor = DebtorMapper.toEntity(debtorDTO);
        debtor.setUser(user);

        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "/uploads/debtors";
                Files.createDirectories(Paths.get(uploadDir));

                String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.copy(file.getInputStream(), filePath);

                // Save relative path
                debtor.setProfilePhotoPath("/uploads/debtors/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image", e);
            }
        }

        debtor = debtorRepository.saveAndFlush(debtor);
        return DebtorMapper.toDTO(debtor);
    }


    // Get all debtors
    public List<DebtorDTO> getDebtorsByUserId(Long userId) {
    System.out.println("Retrieving debtors for user ID: " + userId);
    List<Debtor> debtors = debtorRepository.findDebtorsByUser_Uid(userId);
    System.out.println("Found " + debtors.size() + " debtors for user ID: " + userId);
    return debtors.stream()
            .map(DebtorMapper::toDTO)
            //.peek(dto -> System.out.println("Mapped debtor to DTO: " + dto))
            .collect(Collectors.toList());
}


    // Get debtor by ID
    public Optional<DebtorDTO> getDebtorById(Long id) {
        return debtorRepository.findById(id)
                .map(DebtorMapper::toDTO);
    }

    public Optional<DebtorDTO> updateDebtor(Long id, DebtorDTO debtorDTO, MultipartFile file, Long userId) {
        return debtorRepository.findById(id)
                .map(existingDebtor -> {
                    // Verify the debtor belongs to the user
                    if (!existingDebtor.getUser().getUid().equals(userId)) {
                        throw new RuntimeException("Unauthorized to update this debtor");
                    }

                    // Update basic fields
                    existingDebtor.setDebtorName(debtorDTO.getDebtorName());
                    existingDebtor.setContactNumber(debtorDTO.getContactNumber());
                    existingDebtor.setAddress(debtorDTO.getAddress());
                    existingDebtor.setEmail(debtorDTO.getEmail());
                    //existingDebtor.setTotalBalance(debtorDTO.getTotalBalance());

                    // Handle profile photo update if a new file is provided
                    if (file != null && !file.isEmpty()) {
                        try {
                            String uploadDir = "/uploads/debtors";
                            Files.createDirectories(Paths.get(uploadDir));

                            // Delete old file if exists
                            if (existingDebtor.getProfilePhotoPath() != null) {
                                Path oldFilePath = Paths.get(existingDebtor.getProfilePhotoPath());
                                Files.deleteIfExists(oldFilePath);
                            }

                            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
                            Path filePath = Paths.get(uploadDir, fileName);
                            Files.copy(file.getInputStream(), filePath);

                            // Save relative path
                            existingDebtor.setProfilePhotoPath("/uploads/debtors/" + fileName);
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to store image", e);
                        }
                    }

                    Debtor updatedDebtor = debtorRepository.save(existingDebtor);
                    return DebtorMapper.toDTO(updatedDebtor);
                });
    }

    public boolean deleteDebtor(Long id, Long userId) {
        return debtorRepository.findById(id)
                .map(debtor -> {
                    // Verify the debtor belongs to the user
                    if (!debtor.getUser().getUid().equals(userId)) {
                        throw new RuntimeException("Unauthorized to delete this debtor");
                    }

                    // Delete profile photo if exists
                    if (debtor.getProfilePhotoPath() != null) {
                        try {
                            Path photoPath = Paths.get(debtor.getProfilePhotoPath());
                            Files.deleteIfExists(photoPath);
                        } catch (IOException e) {
                            // Log the error but continue with deletion
                            System.err.println("Failed to delete profile photo: " + e.getMessage());
                        }
                    }

                    // Delete the debtor
                    debtorRepository.delete(debtor);
                    return true;
                })
                .orElse(false);
    }
}
