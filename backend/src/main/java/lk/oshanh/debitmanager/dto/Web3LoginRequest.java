package lk.oshanh.debitmanager.dto;

import lombok.Data;

@Data
public class Web3LoginRequest {
    private String address;
    private String message;
    private String signature;
}
