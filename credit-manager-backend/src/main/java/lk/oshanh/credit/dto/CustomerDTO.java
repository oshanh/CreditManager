package lk.oshanh.credit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO {
    private Long id;
    private String customerName;
    private String contactNumber;
    private String address;
    private String profilePhotoPath;
    private double totalCredit;
}
