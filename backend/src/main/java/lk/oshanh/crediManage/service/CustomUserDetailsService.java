package lk.oshanh.crediManage.service;

import lk.oshanh.crediManage.entity.User;
import lk.oshanh.crediManage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find user by email first
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> {
                    // If not found by email, try to find by Ethereum address
                    return userRepository.findByAddress(username)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found with email/address: " + username));
                });

        System.out.println("\n UserName:"+user+" \n");

        String usernameToUse = user.getEmail() != null ? user.getEmail() : user.getAddress();
        String password = user.getPassword() != null ? user.getPassword() : "{noop}web3-user";

        return new org.springframework.security.core.userdetails.User(
                usernameToUse,
                password,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

    }
} 