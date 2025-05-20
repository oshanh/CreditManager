package lk.oshanh.crediManage.service;

import lk.oshanh.crediManage.dto.DebtorDTO;
import lk.oshanh.crediManage.dto.LoginResponseDTO;
import lk.oshanh.crediManage.dto.RegisterRequest;
import lk.oshanh.crediManage.entity.Debtor;
import lk.oshanh.crediManage.entity.User;
import lk.oshanh.crediManage.mapper.DebtorMapper;
import lk.oshanh.crediManage.repository.DebtorRepository;
import lk.oshanh.crediManage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class DebtorService {


    private final DebtorRepository debtorRepository;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder; // must be configured as a Bean


    public LoginResponseDTO registerNormalUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // hash the password
        user.setNickname(request.getNickname());
        user.setCreatedAt(LocalDateTime.now());
        user.setAddress(null); // since it's not a Web3 user

        User saved = userRepository.save(user);

        LoginResponseDTO response = new LoginResponseDTO();
        response.setSuccess(true);
        response.setId(saved.getUid());
        response.setNickname(saved.getNickname());
        return response;
    }



    // Create a new debtor
    public DebtorDTO createDebtor(DebtorDTO debtorDTO, MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Debtor debtor = DebtorMapper.toEntity(debtorDTO);
        debtor.setUser(user);

        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "uploads/debtors";
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

public List<DebtorDTO> getDebtorsByUserId1(Long userId) {
        return debtorRepository.findDebtorsByUser_Uid(userId)
                .stream()
                .map(DebtorMapper::toDTO)
                .collect(Collectors.toList());
    }


    // Get debtor by ID
    public Optional<DebtorDTO> getDebtorById(Long id) {
        return debtorRepository.findById(id)
                .map(DebtorMapper::toDTO);
    }

    // Update debtor
    public DebtorDTO updateDebtor(Long id, DebtorDTO debtorDTO) {
        Debtor existingDebtor = debtorRepository.findById(id).orElseThrow();
        existingDebtor.setDebtorName(debtorDTO.getDebtorName());
        existingDebtor.setContactNumber(debtorDTO.getContactNumber());
        existingDebtor = debtorRepository.save(existingDebtor);
        return DebtorMapper.toDTO(existingDebtor);
    }

    // Delete debtor
    public void deleteDebtor(Long id) {
        debtorRepository.deleteById(id);
    }
}
