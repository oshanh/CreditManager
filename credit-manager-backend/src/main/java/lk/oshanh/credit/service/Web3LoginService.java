package lk.oshanh.credit.service;

import lk.oshanh.credit.dto.LoginResponseDTO;
import lk.oshanh.credit.dto.Web3LoginRequest;
import lk.oshanh.credit.entity.Web3User;
import lk.oshanh.credit.repository.Web3UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class Web3LoginService {
    private final Web3UserRepository web3UserRepository;


    public boolean verifyWithNode(Web3LoginRequest request){
        String address = request.getAddress();
        String signature = request.getSignature();
        String message = request.getMessage();

        try {
            // Prepare request payload for the verifier Node.js microservice
            Map<String, String> payload = new HashMap<>();
            payload.put("address", address);
            payload.put("message", message);
            payload.put("signature", signature);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(payload, headers);
            RestTemplate restTemplate = new RestTemplate();

            // Assuming your Node.js verifier runs on port 3001
            String verifierUrl = "http://localhost:3001/api/verify";

            ResponseEntity<Map> response = restTemplate.exchange(
                    verifierUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            boolean isValid = responseBody != null && Boolean.TRUE.equals(responseBody.get("valid"));
            System.out.println("\n\n validity : "+isValid +"\n\n");

            if (isValid) {
                return true;
            } else {
                return false;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }

    public LoginResponseDTO loginOrRegisterWeb3User(Web3LoginRequest request){
        // Create or get user
        Web3User web3User = web3UserRepository.findById(request.getAddress()).orElseGet(() -> {
            Web3User newWeb3User = new Web3User();
            newWeb3User.setAddress(request.getAddress());
            newWeb3User.setCreatedAt(LocalDateTime.now());
            newWeb3User.setNickname("User_" + request.getAddress().substring(2, 6));
            return newWeb3User;
        });

        Web3User savedWeb3User = web3UserRepository.save(web3User);

        LoginResponseDTO responseDTO=new LoginResponseDTO();
        responseDTO.setSuccess(true);
        responseDTO.setNickname(savedWeb3User.getNickname());


        System.out.println("\nLast line called\n"+responseDTO.getNickname()+"\n"+responseDTO.isSuccess());

        return responseDTO;
    }




}
