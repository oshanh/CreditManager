package lk.oshanh.credimanage.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

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
} 