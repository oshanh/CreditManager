package lk.oshanh.crediManage.mapper;

import lk.oshanh.crediManage.entity.Customer;
import lk.oshanh.crediManage.dto.CustomerDTO;


public class CustomerMapper {

    public static CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setCustomerName(customer.getCustomerName());
        dto.setContactNumber(customer.getContactNumber());
        dto.setAddress(customer.getAddress());
        dto.setProfilePhotoPath(customer.getProfilePhotoPath());
        dto.setTotalBalance(customer.getTotalBalance());
        dto.setEmail(customer.getEmail());
        return dto;
    }

    public static Customer toEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setCustomerName(dto.getCustomerName());
        customer.setContactNumber(dto.getContactNumber());
        customer.setAddress(dto.getAddress());
        customer.setProfilePhotoPath(dto.getProfilePhotoPath());
        customer.setTotalBalance(dto.getTotalBalance());
        customer.setEmail(dto.getEmail());
        return customer;
    }
}
