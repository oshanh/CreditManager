package lk.oshanh.credit.mapper;

import lk.oshanh.credit.entity.Customer;
import lk.oshanh.credit.dto.CustomerDTO;


public class CustomerMapper {

    public static CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setCustomerName(customer.getCustomerName());
        dto.setContactNumber(customer.getContactNumber());
        return dto;
    }

    public static Customer toEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setCustomerName(dto.getCustomerName());
        customer.setContactNumber(dto.getContactNumber());
        return customer;
    }
}
