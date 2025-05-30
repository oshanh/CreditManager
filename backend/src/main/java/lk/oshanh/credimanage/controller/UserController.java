package lk.oshanh.credimanage.controller;

import lk.oshanh.credimanage.dto.ResponseDTO;
import lk.oshanh.credimanage.dto.UserUpdateDTO;
import lk.oshanh.credimanage.entity.User;
import lk.oshanh.credimanage.security.SecurityUtils;
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
} 