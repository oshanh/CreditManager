import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';

import customerService from '../services/customerService';

const AddDebtor = () => {
  const initialFormData = {
    profilePhoto: null,
    profilePhotoPreview: null,
    name: '',
    phoneNumber: '',
    address: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData({
            ...formData,
            profilePhoto: file,
            profilePhotoPreview: reader.result,
          });
        };
        reader.readAsDataURL(file);
      } else {
        setFormData({
          ...formData,
          profilePhoto: null,
          profilePhotoPreview: null,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerPayload = {
      customerName: formData.name,
      contactNumber: formData.phoneNumber,
      address: formData.address,
      // Do not send image here - file is sent separately
    };

    try {
      const response = await customerService.addCustomer(customerPayload, formData.profilePhoto);
      console.log('Customer added:', response.data);
      alert('Customer added successfully!');
      setFormData(initialFormData);
    } catch (error) {
      console.error('Failed to add customer:', error);
      alert('Failed to add customer');
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Add New Debtor
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={formData.profilePhotoPreview}
            sx={{ width: 72, height: 72, mb: 1 }}
          />
          <Button variant="contained" component="label">
            Upload Photo
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              hidden
              onChange={handleChange}
            />
          </Button>
        </Box>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          fullWidth
          multiline
          minRows={2}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Debtor
        </Button>
      </Box>
    </Paper>
  );
};

export default AddDebtor;
