package lk.oshanh.credit.mapper;

import lk.oshanh.credit.entity.Credit;
import lk.oshanh.credit.dto.CreditDTO;

public class CreditMapper {

    public static CreditDTO toDTO(Credit credit) {
        CreditDTO dto = new CreditDTO();
        dto.setId(credit.getId());
        dto.setCreditAmount(credit.getCreditAmount());
        dto.setDescription(credit.getDescription());
        dto.setDueDate(credit.getDueDate());
        dto.setCustomerId(credit.getCustomer().getId());  // Mapping the customer ID
        return dto;
    }

    public static Credit toEntity(CreditDTO dto) {
        Credit credit = new Credit();
        credit.setId(dto.getId());
        credit.setCreditAmount(dto.getCreditAmount());
        credit.setDescription(dto.getDescription());
        credit.setDueDate(dto.getDueDate());
        return credit;
    }
}
