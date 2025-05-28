import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import debtorService from '../../services/debtorService';

const DebtorFormModal = ({ isOpen, onClose, debtor, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (debtor) {
      setFormData({
        name: debtor.debtorName || '',
        email: debtor.email || '',
        phone: debtor.contactNumber || '',
        address: debtor.address || '',
        profilePhoto: null,
      });
      if (debtor.profilePhotoPath) {
        setPhotoPreview(debtorService.getSecureFileUrl(debtor.profilePhotoPath));
      }
    } else {
      // Reset form when opening for new debtor
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        profilePhoto: null,
      });
      setPhotoPreview(null);
    }
  }, [debtor]);

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
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (file.size > maxSize) {
        setError('File size should not exceed 5MB');
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
    }

    try {
      if (debtor) {
        await debtorService.updateDebtor(debtor.id, payload, formData.profilePhoto);
      } else {
        await debtorService.createDebtor(payload, formData.profilePhoto);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form data after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        profilePhoto: null,
      });
      setPhotoPreview(null);
      setFormErrors({});
      
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${debtor ? 'update' : 'add'} debtor`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {debtor ? 'Edit Debtor' : 'Add New Debtor'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Profile Photo</label>
                <div className="relative w-32 h-32 mb-2">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile Preview" className="h-full w-full rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
                  ) : (
                    <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <span className="text-3xl font-bold">{formData.name.charAt(0) || '?'}</span>
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-300"
                  disabled={uploading}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maximum file size: 5MB</p>
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
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={uploading || isLoading}
                >
                  {debtor ? 'Save Changes' : 'Add Debtor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtorFormModal; 