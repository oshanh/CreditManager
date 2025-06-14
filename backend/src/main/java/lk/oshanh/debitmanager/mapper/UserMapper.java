package lk.oshanh.debitmanager.mapper;

import lk.oshanh.debitmanager.dto.UserUpdateDTO;
import lk.oshanh.debitmanager.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public void updateUserFromDTO(User user, UserUpdateDTO dto) {
        if (dto.getNickname() != null) {
            user.setNickname(dto.getNickname());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getAddress() != null) {
            user.setAddress(dto.getAddress());
        }
    }

} 