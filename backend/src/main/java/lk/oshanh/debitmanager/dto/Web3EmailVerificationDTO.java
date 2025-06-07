package lk.oshanh.debitmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Web3EmailVerificationDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Web3 address is required")
    private String address;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Signature is required")
    private String signature;

    private String otp;
} 