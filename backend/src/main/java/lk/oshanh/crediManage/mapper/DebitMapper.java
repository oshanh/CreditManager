package lk.oshanh.credimanage.mapper;

import lk.oshanh.credimanage.entity.Debit;
import lk.oshanh.credimanage.dto.DebitDTO;

public class DebitMapper {

    public static DebitDTO toDTO(Debit debit) {
        DebitDTO dto = new DebitDTO();
        dto.setId(debit.getId());
        dto.setDebitAmount(debit.getDebitAmount());
        dto.setDescription(debit.getDescription());
        dto.setDueDate(debit.getDueDate());
        dto.setDebtorId(debit.getDebtor().getId());  // Mapping the customer ID
        return dto;
    }

    public static Debit toEntity(DebitDTO dto) {
        Debit debit = new Debit();
        debit.setId(dto.getId());
        debit.setDebitAmount(dto.getDebitAmount());
        debit.setDescription(dto.getDescription());
        debit.setDueDate(dto.getDueDate());
        return debit;
    }
}
