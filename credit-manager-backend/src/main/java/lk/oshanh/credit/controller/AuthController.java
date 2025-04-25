package lk.oshanh.credit.controller;
import lk.oshanh.credit.dto.LoginResponseDTO;
import lk.oshanh.credit.entity.User;
import lk.oshanh.credit.repository.UserRepository;
import lk.oshanh.credit.dto.Web3LoginRequest;
import lk.oshanh.credit.service.Web3LoginService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {


    private final Web3LoginService web3LoginService;

    @PostMapping("/web3")
    public ResponseEntity<LoginResponseDTO> loginWithWeb3(@RequestBody Web3LoginRequest request) {

        boolean isValid=web3LoginService.verifyWithNode(request);



        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponseDTO(false,"notValid"));
        }

        LoginResponseDTO responseDTO=web3LoginService.loginOrRegisterWeb3User(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(responseDTO);



    }
}
