package lk.oshanh.debitmanager.security;

import lk.oshanh.debitmanager.entity.User;
import lk.oshanh.debitmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        System.out.println("\n======\n"+authentication+"\n=======\n");
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        System.out.println("\n======\n"+userDetails+"\n=======\n");
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseGet(() -> (userRepository.findByAddress(userDetails.getUsername()))
                .orElse(null));
    }

    public Long getCurrentUserId() {
        User user = getCurrentUser();
        System.out.println("\n======\n"+"User ID retrieved : "+user.getUid()+"\n=======\n");
        return user != null ? user.getUid() : null;
    }

    //get user address
    public String getCurrentWeb3Address(){
        User user = getCurrentUser();
        String address = user.getAddress();
        System.out.println("\n======\n"+"Address retrieved : "+address+"\n=======\n");
        return user != null ? user.getAddress() : null;
    }
} 