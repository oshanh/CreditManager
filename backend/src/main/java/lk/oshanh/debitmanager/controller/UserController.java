package lk.oshanh.debitmanager.controller;

import lk.oshanh.debitmanager.dto.AuthResponse;
import lk.oshanh.debitmanager.dto.UserUpdateDTO;
import lk.oshanh.debitmanager.dto.Web3EmailVerificationDTO;
import lk.oshanh.debitmanager.entity.User;
import lk.oshanh.debitmanager.security.SecurityUtils;
import lk.oshanh.debitmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;


    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User user) {

        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserUpdateDTO> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @RequestBody UserUpdateDTO updateDTO) {
        System.out.println(updateDTO);

        UserUpdateDTO updatedUser = userService.updateUser(securityUtils.getCurrentUserId(), updateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/update/email")
    public ResponseEntity<UserUpdateDTO> initiateEmailChange(
            @AuthenticationPrincipal User user,
            @RequestBody UserUpdateDTO updateDTO) {
        UserUpdateDTO response = userService.initiateEmailChange(securityUtils.getCurrentUserId(), updateDTO.getEmail());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/email/verify")
    public ResponseEntity<AuthResponse> verifyAndUpdateEmail(
            @AuthenticationPrincipal User user,
            @RequestBody UserUpdateDTO updateDTO) {
        AuthResponse response = userService.verifyAndUpdateEmail(securityUtils.getCurrentUserId(), updateDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/web3/email/verify")
    public ResponseEntity<?> initiateWeb3EmailVerification(
            @RequestBody Web3EmailVerificationDTO verificationDTO) {
        ResponseEntity<?> response = userService.initiateWeb3EmailVerification(verificationDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @PutMapping("/web3/email/verify/otp")
    public ResponseEntity<?> verifyWeb3EmailOTP(
            @RequestBody Web3EmailVerificationDTO verificationDTO) {
        ResponseEntity<?> response = userService.verifyWeb3EmailOTP(verificationDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
} 