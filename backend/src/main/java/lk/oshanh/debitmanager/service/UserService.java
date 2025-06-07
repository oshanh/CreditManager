package lk.oshanh.debitmanager.service;

import jakarta.mail.MessagingException;
import lk.oshanh.debitmanager.dto.AuthResponse;
import lk.oshanh.debitmanager.dto.UserUpdateDTO;
import lk.oshanh.debitmanager.dto.Web3EmailVerificationDTO;
import lk.oshanh.debitmanager.entity.User;
import lk.oshanh.debitmanager.exception.ResourceNotFoundException;
import lk.oshanh.debitmanager.exception.UnauthorizedException;
import lk.oshanh.debitmanager.exception.BadRequestException;
import lk.oshanh.debitmanager.mapper.UserMapper;
import lk.oshanh.debitmanager.repository.UserRepository;
import lk.oshanh.debitmanager.security.JwtTokenProvider;
import lk.oshanh.debitmanager.security.SecurityUtils;
import lk.oshanh.debitmanager.utils.Web3Verifier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;


@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtTokenProvider jwtTokenProvider;
    private final SecurityUtils securityUtils;

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public UserUpdateDTO updateUser(Long userId, UserUpdateDTO updateDTO) {
        User user = getUserById(userId);

        // Update basic info if provided
        if (updateDTO.getNickname() != null || updateDTO.getEmail() != null || updateDTO.getAddress() != null) {
            // Check if email is being changed and if it's already taken
            if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(updateDTO.getEmail())) {
                    throw new BadRequestException("Email is already taken");
                }
            }

            // Check if address is being changed and if it's already taken
            if (updateDTO.getAddress() != null && !updateDTO.getAddress().equals(user.getAddress())) {
                if (userRepository.existsByAddress(updateDTO.getAddress())) {
                    throw new BadRequestException("Web3 address is already taken");
                }
            }

            userMapper.updateUserFromDTO(user, updateDTO);
        }

        // Update password if provided
        if (updateDTO.getNewPassword() != null) {
            // Verify current password
            if (updateDTO.getCurrentPassword() == null) {
                throw new UnauthorizedException("Current password is required to set a new password");
            }

            if (!passwordEncoder.matches(updateDTO.getCurrentPassword(), user.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect");
            }

            // Update password
            user.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
        }

        User updated=userRepository.save(user);

        UserUpdateDTO updatedUser=new UserUpdateDTO();

        updatedUser.setAddress(updated.getAddress());
        updatedUser.setEmail(updated.getEmail());
        updatedUser.setNickname(updated.getNickname());

        return updatedUser;
    }

    @Transactional
    public UserUpdateDTO initiateEmailChange(Long userId, String newEmail) {
        User user = getUserById(userId);
        
        // Check if new email is already taken
        if (userRepository.existsByEmail(newEmail)) {
            throw new BadRequestException("Email is already taken");
        }

        // Generate OTPs
        String oldEmailOtp = emailService.generateOTP();
        String newEmailOtp = emailService.generateOTP();

        try {
            // Send OTP to old email
            emailService.sendEmailChangeNotification(user.getEmail(), newEmail, oldEmailOtp);
            // Send OTP to new email
            emailService.sendNewEmailVerification(newEmail, newEmailOtp);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }

        // Store OTPs
        otpStore.put(user.getEmail(), oldEmailOtp);
        otpStore.put(newEmail, newEmailOtp);

        UserUpdateDTO response = new UserUpdateDTO();
        response.setEmail(newEmail);
        return response;
    }

    @Transactional
    public AuthResponse verifyAndUpdateEmail(Long userId, UserUpdateDTO updateDTO) {
        User user = getUserById(userId);

        // Check OTPs
        
        if (updateDTO.getOldEmailOtp() == null || updateDTO.getNewEmailOtp() == null) {
            throw new BadRequestException("Both OTPs are required");
        }

        // Verify OTPs (in a real application, you would store and verify these OTPs)
        String storedOldEmailOtp = otpStore.get(user.getEmail());
        String storedNewEmailOtp = otpStore.get(updateDTO.getEmail());

        if (!updateDTO.getOldEmailOtp().equals(storedOldEmailOtp) || !updateDTO.getNewEmailOtp().equals(storedNewEmailOtp)) {
            throw new BadRequestException("Invalid OTPs");
        }


        // Update email
        user.setEmail(updateDTO.getEmail());
        user.setEmailVerified(true);
        
        User updated = userRepository.save(user);

        otpStore.remove(user.getEmail());
        otpStore.remove(updateDTO.getEmail());

        // Send changing email success notification
        try {
            emailService.sendEmailChangeSuccessNotification(user.getEmail(), updateDTO.getEmail());
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }

        return AuthResponse.builder()
                .isAuthenticated(true)
                .token(jwtTokenProvider.generateToken(updated.getEmail()))
                .email(updated.getEmail())
                .nickname(updated.getNickname())
                .address(updated.getAddress())
                .build();

        
//        UserUpdateDTO response = new UserUpdateDTO();
//        response.setEmail(updated.getEmail());
//
//        return response;
    }

    @Transactional
    public ResponseEntity<?> initiateWeb3EmailVerification(Web3EmailVerificationDTO verificationDTO) {

        // Verify Web3 signature
        if (!Web3Verifier.verifySignature(
                securityUtils.getCurrentuserWeb3Address(),
                verificationDTO.getMessage(),
                verificationDTO.getSignature())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Web3 signature");
            //throw new UnauthorizedException("Invalid Web3 signature");
        }

        // Check if email is already taken
        if (userRepository.existsByEmail(verificationDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already taken");
        }

        // Generate OTP
        String otp = emailService.generateOTP();

        try {
            // Send OTP to new email
            emailService.sendNewEmailVerification(verificationDTO.getEmail(), otp);
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP request failed");
        }

        // Store OTP
        otpStore.put(verificationDTO.getEmail(), otp);


        UserUpdateDTO response = new UserUpdateDTO();
        response.setEmail(verificationDTO.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Transactional
    public ResponseEntity<?> verifyWeb3EmailOTP(Web3EmailVerificationDTO verificationDTO) {
        // Verify Web3 signature again
        if (!Web3Verifier.verifySignature(
                securityUtils.getCurrentuserWeb3Address(),
                verificationDTO.getMessage(),
                verificationDTO.getSignature())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Web3 signature");
        }

        // Verify OTP
        String storedOtp = otpStore.get(verificationDTO.getEmail());

        if (storedOtp == null || !storedOtp.equals(verificationDTO.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
        }

        // Find user by address
        User user = userRepository.findByAddress(verificationDTO.getAddress())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with address: " + verificationDTO.getAddress()));

        // Update email
        user.setEmail(verificationDTO.getEmail());
        user.setEmailVerified(true);
        
        User updated = userRepository.save(user);

        // Remove OTP from store
        otpStore.remove(verificationDTO.getEmail());

        // Send success notification
        try {
            emailService.sendEmailChangeSuccessNotification(verificationDTO.getEmail(), verificationDTO.getEmail());
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }

        return ResponseEntity.status(HttpStatus.OK).body(AuthResponse.builder()
                .isAuthenticated(true)
                .token(jwtTokenProvider.generateToken(updated.getAddress()))
                .email(updated.getEmail())
                .nickname(updated.getNickname())
                .address(updated.getAddress())
                .build());
    }
} 