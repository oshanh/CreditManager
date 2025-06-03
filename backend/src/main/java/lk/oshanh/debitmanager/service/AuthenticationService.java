package lk.oshanh.debitmanager.service;

import jakarta.mail.MessagingException;
import lk.oshanh.debitmanager.dto.*;
import lk.oshanh.debitmanager.entity.User;
import lk.oshanh.debitmanager.repository.UserRepository;
import lk.oshanh.debitmanager.security.JwtTokenProvider;
import lk.oshanh.debitmanager.utils.Web3Verifier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // Store OTPs and registration data temporarily (in production, use Redis or similar)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, RegistrationData> registrationDataStore = new ConcurrentHashMap<>();
    private final Map<String, String> passwordResetTokens = new ConcurrentHashMap<>();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .email("Email already exists")
                    .build();
        }

        try {
            String otp = emailService.generateOTP();
            otpStore.put(request.getEmail(), otp);
            
            // Store registration data
            RegistrationData registrationData = new RegistrationData();
            registrationData.setNickname(request.getNickname());
            registrationData.setEmail(request.getEmail());
            registrationData.setPassword(request.getPassword());
            registrationData.setAddress(request.getAddress());
            registrationDataStore.put(request.getEmail(), registrationData);
            
            emailService.sendOTPEmail(request.getEmail(), otp);
            
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .email(request.getEmail())
                    .message("OTP sent to your email")
                    .build();
        } catch (MessagingException e) {
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .email("Failed to send verification email")
                    .build();
        }
    }

    @Transactional
    public AuthResponse verifyOTP(OTPRequest request) {
        String storedOTP = otpStore.get(request.getEmail());
        if (storedOTP == null || !storedOTP.equals(request.getOtp())) {
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .email("Invalid OTP")
                    .build();
        }

        // Get stored registration data
        RegistrationData registrationData = registrationDataStore.get(request.getEmail());
        if (registrationData == null) {
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .email("Registration data not found")
                    .build();
        }

        // Clear OTP and registration data after successful verification
        otpStore.remove(request.getEmail());
        registrationDataStore.remove(request.getEmail());

        // Create user after OTP verification
        User user = new User();
        user.setEmail(registrationData.getEmail());
        user.setPassword(passwordEncoder.encode(registrationData.getPassword()));
        user.setNickname(registrationData.getNickname());
        user.setAddress(registrationData.getAddress());
        user.setCreatedAt(LocalDateTime.now());
        user.setEmailVerified(true);

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponse.builder()
                .isAuthenticated(true)
                .token(token)
                .email(user.getEmail())
                .nickname(user.getNickname())
                .address(user.getAddress())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("\n======\nlogin function started\n=========\n");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        log.info(String.valueOf(authentication.isAuthenticated()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponse.builder()
                .isAuthenticated(true)
                .token(token)
                .email(user.getEmail())
                .nickname(user.getNickname())
                .address(user.getAddress())
                .build();
    }

    public AuthResponse web3Login(Web3LoginRequest request) {
        // Verify the signature using Web3Verifier
        if (!Web3Verifier.verifySignature(request.getAddress(), request.getMessage(), request.getSignature())) {
            throw new RuntimeException("Invalid signature");
        }

        // Find or create user
        User user = userRepository.findByAddress(request.getAddress())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setAddress(request.getAddress());
                    newUser.setNickname("Web3User_" + request.getAddress().substring(0, 6));
                    //newUser.setEmail("");
                    newUser.setCreatedAt(LocalDateTime.now());
                    return userRepository.save(newUser);
                });

        String token = jwtTokenProvider.generateToken(user.getAddress());
        return AuthResponse.builder()
                .isAuthenticated(true)
                .token(token)
                .email(user.getEmail())
                .nickname(user.getNickname())
                .address(user.getAddress())
                .build();
    }

    @Transactional
    public AuthResponse requestPasswordReset(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            // Don't reveal that the email doesn't exist
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .message("If an account exists with this email, you will receive a password reset link.")
                    .build();
        }

        try {
            String resetToken = UUID.randomUUID().toString();
            passwordResetTokens.put(resetToken, user.getEmail());
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);

            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .message("If an account exists with this email, you will receive a password reset link.")
                    .build();
        } catch (MessagingException e) {
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .message("Failed to send password reset email. Please try again.")
                    .build();
        }
    }

    @Transactional
    public AuthResponse confirmPasswordReset(PasswordResetConfirmRequest request) {
        String email = passwordResetTokens.get(request.getToken());
        if (email == null) {
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .message("Invalid or expired reset token.")
                    .build();
        }

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return AuthResponse.builder()
                    .isAuthenticated(false)
                    .message("User not found.")
                    .build();
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordResetTokens.remove(request.getToken());

        return AuthResponse.builder()
                .isAuthenticated(true)
                .message("Password has been reset successfully.")
                .build();
    }
} 