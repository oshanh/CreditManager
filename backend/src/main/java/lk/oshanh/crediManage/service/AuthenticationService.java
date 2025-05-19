package lk.oshanh.crediManage.service;

import lk.oshanh.crediManage.dto.AuthResponse;
import lk.oshanh.crediManage.dto.LoginRequest;
import lk.oshanh.crediManage.dto.RegisterRequest;
import lk.oshanh.crediManage.dto.Web3LoginRequest;
import lk.oshanh.crediManage.entity.User;
import lk.oshanh.crediManage.repository.UserRepository;
import lk.oshanh.crediManage.security.JwtTokenProvider;
import lk.oshanh.crediManage.utils.Web3Verifier;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setNickname(request.getNickname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setCreatedAt(LocalDateTime.now());

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
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

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
} 