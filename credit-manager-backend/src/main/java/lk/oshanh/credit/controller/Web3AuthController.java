package lk.oshanh.credit.controller;
import lk.oshanh.credit.entity.User;
import lk.oshanh.credit.repository.UserRepository;
import lk.oshanh.credit.dto.Web3LoginRequest;
import lk.oshanh.credit.utils.Web3Verifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class Web3AuthController {

    private final UserRepository userRepository;

    @PostMapping("/web3")
    public ResponseEntity<?> loginWithWeb3(@RequestBody Web3LoginRequest request) {
        boolean isValid = Web3Verifier.verifySignature(
                request.getAddress(), request.getMessage(), request.getSignature());

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false));
        }

        // Create or get user
        User user = userRepository.findById(request.getAddress()).orElseGet(() -> {
            User newUser = new User();
            newUser.setAddress(request.getAddress());
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setNickname("User_" + request.getAddress().substring(2, 6));
            return newUser;
        });

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "address", user.getAddress(),
                "nickname", user.getNickname()
        ));
    }
}
