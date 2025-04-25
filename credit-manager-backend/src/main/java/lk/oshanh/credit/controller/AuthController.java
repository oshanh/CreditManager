package lk.oshanh.credit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.web3j.crypto.*;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest authRequest) {
        String address = authRequest.getAddress();
        String signature = authRequest.getSignature();
        String message = "Sign this message to log in to our dApp!"; // This should be consistent on the frontend

        try {
            String recoveredAddress = verifySignature(message, signature);
            if (recoveredAddress != null && recoveredAddress.equalsIgnoreCase(address)) {
                // Authentication successful
                // Here you might generate a JWT or manage a session
                Map<String, String> response = new HashMap<>();
                response.put("message", "Login successful!");
                response.put("address", recoveredAddress);
                // You might also include a session token here
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid signature."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error verifying signature: " + e.getMessage()));
        }
    }

    private String verifySignature(String message, String signature) throws Exception {
        byte[] messageBytes = message.getBytes();
        byte[] messageHash = Hash.sha3(messageBytes);
        byte[] signatureBytes = Numeric.hexStringToByteArray(signature);
        byte v = signatureBytes[64];
        if (v < 27) {
            v += 27;
        }
        Sign.SignatureData sd = new Sign.SignatureData(
                (byte) v,
                new byte[32],
                new byte[32]
        );
        System.arraycopy(signatureBytes, 0, sd.getR(), 0, 32);
        System.arraycopy(signatureBytes, 32, sd.getS(), 0, 32);
        BigInteger publicKey = Sign.signedMessageToKey(messageHash, sd);
        return Keys.getAddress(publicKey);
    }

    public static class AuthRequest {
        private String address;
        private String signature;

        // Getters and setters
        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getSignature() {
            return signature;
        }

        public void setSignature(String signature) {
            this.signature = signature;
        }
    }
}