package lk.oshanh.credimanage.controller;

import lk.oshanh.credimanage.dto.UserUpdateDTO;
import lk.oshanh.credimanage.entity.User;
import lk.oshanh.credimanage.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User user) {

        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @RequestBody UserUpdateDTO updateDTO) {
        System.out.println(user);
        User updatedUser = userService.updateUser(user.getUid(), updateDTO);
        return ResponseEntity.ok(updatedUser);
    }
} 