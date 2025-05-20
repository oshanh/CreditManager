package lk.oshanh.crediManage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DebtorDTO {
    private Long id;
    private String debtorName;
    private String contactNumber;
    private String address;
    private String profilePhotoPath;
    private double totalBalance;
    private String email;
}
