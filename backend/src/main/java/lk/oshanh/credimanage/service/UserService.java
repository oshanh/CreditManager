package lk.oshanh.credimanage.service;

import lk.oshanh.credimanage.dto.ResponseDTO;
import lk.oshanh.credimanage.dto.UserUpdateDTO;
import lk.oshanh.credimanage.entity.User;
import lk.oshanh.credimanage.exception.ResourceNotFoundException;
import lk.oshanh.credimanage.exception.UnauthorizedException;
import lk.oshanh.credimanage.exception.BadRequestException;
import lk.oshanh.credimanage.mapper.UserMapper;
import lk.oshanh.credimanage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public UserUpdateDTO updateUser(Long userId, UserUpdateDTO updateDTO) {
        User user = getUserById(userId);

        // Update basic info if provided
        if (updateDTO.getNickname() != null || updateDTO.getEmail() != null || updateDTO.getAddress() != null) {
            // Check if email is being changed and if it's already taken
            if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(updateDTO.getEmail())) {
                    throw new BadRequestException("Email is already taken");
                }
            }

            // Check if address is being changed and if it's already taken
            if (updateDTO.getAddress() != null && !updateDTO.getAddress().equals(user.getAddress())) {
                if (userRepository.existsByAddress(updateDTO.getAddress())) {
                    throw new BadRequestException("Web3 address is already taken");
                }
            }

            userMapper.updateUserFromDTO(user, updateDTO);
        }

        // Update password if provided
        if (updateDTO.getNewPassword() != null) {
            // Verify current password
            if (updateDTO.getCurrentPassword() == null) {
                throw new UnauthorizedException("Current password is required to set a new password");
            }

            if (!passwordEncoder.matches(updateDTO.getCurrentPassword(), user.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect");
            }

            // Update password
            user.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
        }

        User updated=userRepository.save(user);

        UserUpdateDTO updatedUser=new UserUpdateDTO();

        updatedUser.setAddress(updated.getAddress());
        updatedUser.setEmail(updated.getEmail());
        updatedUser.setNickname(updated.getNickname());

        return updatedUser;
    }
} 