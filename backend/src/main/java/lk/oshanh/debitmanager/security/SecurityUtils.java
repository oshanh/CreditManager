package lk.oshanh.debitmanager.security;

import lk.oshanh.debitmanager.entity.User;
import lk.oshanh.debitmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseGet(() -> (userRepository.findByAddress(userDetails.getUsername()))
                .orElse(null));
    }

    public Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getUid() : null;
    }

    //get user address
    public String getCurrentuserWeb3Address(){
        User user = getCurrentUser();
        return user != null ? user.getAddress() : null;
    }
} 