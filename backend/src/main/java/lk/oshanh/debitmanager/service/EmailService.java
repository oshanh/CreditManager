package lk.oshanh.debitmanager.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private static final String FROM_EMAIL = "oshanedu@gmail.com"; // Replace with your Gmail

    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public void sendOTPEmail(String to, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(FROM_EMAIL);
        helper.setTo(to);
        helper.setSubject("Email Verification OTP");
        helper.setText(String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Email Verification</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">%s</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </body>
            </html>
            """, otp), true);

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String resetToken) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(FROM_EMAIL);
        helper.setTo(to);
        helper.setSubject("Password Reset Request");
        helper.setText(String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You have requested to reset your password. Click the link below to reset your password:</p>
                <p>
                    <a href="http://localhost:3000/reset-password/%s" 
                       style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                        Reset Password
                    </a>
                </p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this password reset, please ignore this email.</p>
            </body>
            </html>
            """, resetToken), true);

        mailSender.send(message);
        log.info("mail sent");
    }
} 