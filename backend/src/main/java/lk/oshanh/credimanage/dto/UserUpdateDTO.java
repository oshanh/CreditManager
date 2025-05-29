package lk.oshanh.credimanage.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String nickname;
    private String email;
    private String address;
    private String currentPassword;
    private String newPassword;
} 