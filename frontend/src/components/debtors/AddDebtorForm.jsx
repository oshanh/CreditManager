import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { formatPhoneNumber } from '../../utils/format';
import useDebounce from '../../hooks/useDebounce';
import useLocalStorage from '../../hooks/useLocalStorage';
import config from '../../config';
import debtorService from '../../services/debtorService';

const AddDebtorForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    initialDebt: '',
    profilePhoto: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        setError('File size should not exceed 1MB');
        return;
      }

      setUploading(true);
      setUploadProgress(0);
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setUploading(false);
        }
      }, 80);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Debtor Name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Contact Number is required';
    } else if (!/^\d{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (formData.initialDebt === '' || parseFloat(formData.initialDebt) < 0 || isNaN(parseFloat(formData.initialDebt))) {
        errors.initialDebt = 'Initial Credit Amount is required and must be a non-negative number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const payload = {
      debtorName: formData.name,
      email: formData.email,
      address: formData.address,
      contactNumber: formData.phone,
      totalBalance: parseFloat(formData.initialDebt) || 0,
    }

    try {
      const data = await debtorService.createDebtor(payload, formData.profilePhoto);

      if (onSuccess) {
        onSuccess(data);
      }
      navigate('/debtors');
    } catch (err) {
      setError(err.message || 'Failed to add debtor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Debtor</h1>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Profile Photo</label>
          <div className="relative w-32 h-32 mb-2">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile Preview" className="h-full w-full rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
            ) : (
              <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <span className="text-3xl font-bold">?</span>
              </div>
            )}
            {uploading && (
              <svg className="absolute top-0 left-0 h-full w-full animate-spin text-blue-500 drop-shadow-lg" viewBox="0 0 48 48">
                <circle className="opacity-30" cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" fill="none" />
                <circle
                  className="text-blue-500"
                  cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" fill="none"
                  strokeDasharray={138.2}
                  strokeDashoffset={138.2 - (uploadProgress / 100) * 138.2}
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={uploading}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maximum file size: 1MB</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            error={formErrors.name}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="(123) 456-7890"
            error={formErrors.phone}
          />

          <Input
            label="Initial Debt Amount"
            name="initialDebt"
            type="number"
            value={formData.initialDebt}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            error={formErrors.initialDebt}
          />

          <div className="md:col-span-2">
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="123 Main St, City, State ZIP"
              error={formErrors.address}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/debtors')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={uploading || isLoading}
          >
            Add Debtor
          </Button>
        </div>
      </div>
    </form>
  );
};

AddDebtorForm.propTypes = {
  onSuccess: PropTypes.func
};

export default AddDebtorForm; 