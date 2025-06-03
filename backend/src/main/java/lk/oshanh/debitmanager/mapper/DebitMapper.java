package lk.oshanh.debitmanager.mapper;

import lk.oshanh.debitmanager.entity.Debit;
import lk.oshanh.debitmanager.dto.DebitDTO;

public class DebitMapper {

    public static DebitDTO toDTO(Debit debit) {
        DebitDTO dto = new DebitDTO();
        dto.setId(debit.getId());
        dto.setDebitAmount(debit.getDebitAmount());
        dto.setDescription(debit.getDescription());
        dto.setIssueDate(debit.getIssueDate());
        dto.setDueDate(debit.getDueDate());
        dto.setType(debit.getType());
        dto.setDebtorId(debit.getDebtor().getId());
        dto.setTotalRepayments(debit.getTotalRepayments());
        

        
        return dto;
    }

    public static Debit toEntity(DebitDTO dto) {
        Debit debit = new Debit();
        debit.setId(dto.getId());
        debit.setDebitAmount(dto.getDebitAmount());
        debit.setDescription(dto.getDescription());
        debit.setIssueDate(dto.getIssueDate());
        debit.setDueDate(dto.getDueDate());
        debit.setType(dto.getType());
        return debit;
    }
}
