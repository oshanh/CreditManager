package lk.oshanh.debitmanager.mapper;

import lk.oshanh.debitmanager.entity.Debtor;
import lk.oshanh.debitmanager.dto.DebtorDTO;


public class DebtorMapper {

    public static DebtorDTO toDTO(Debtor debtor) {
        DebtorDTO dto = new DebtorDTO();
        dto.setId(debtor.getId());
        dto.setDebtorName(debtor.getDebtorName());
        dto.setContactNumber(debtor.getContactNumber());
        dto.setAddress(debtor.getAddress());
        dto.setProfilePhotoPath(debtor.getProfilePhotoPath());
        dto.setTotalBalance(debtor.getTotalBalance());
        dto.setEmail(debtor.getEmail());
        return dto;
    }

    public static Debtor toEntity(DebtorDTO dto) {
        Debtor debtor = new Debtor();
        debtor.setId(dto.getId());
        debtor.setDebtorName(dto.getDebtorName());
        debtor.setContactNumber(dto.getContactNumber());
        debtor.setAddress(dto.getAddress());
        debtor.setProfilePhotoPath(dto.getProfilePhotoPath());
        debtor.setTotalBalance(dto.getTotalBalance());
        debtor.setEmail(dto.getEmail());
        return debtor;
    }
}
