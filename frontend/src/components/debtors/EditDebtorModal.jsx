import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import debtorService from '../../services/debtorService';

const EditDebtorModal = ({ isOpen, onClose, debtor, onSuccess }) => {
  const [formData, setFormData] = useState({
    debtorName: '',
    contactNumber: '',
    address: '',
    profilePhoto: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (debtor) {
      setFormData({
        debtorName: debtor.debtorName || '',
        contactNumber: debtor.contactNumber || '',
        address: debtor.address || '',
        profilePhoto: null
      });
    }
  }, [debtor]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('debtorName', formData.debtorName);
      formDataToSend.append('contactNumber', formData.contactNumber);
      formDataToSend.append('address', formData.address);
      if (formData.profilePhoto) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      }

      await debtorService.updateDebtor(debtor.id, formDataToSend);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update debtor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Edit Debtor
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="debtorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="debtorName"
                  name="debtorName"
                  value={formData.debtorName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profile Photo
                </label>
                <input
                  type="file"
                  id="profilePhoto"
                  name="profilePhoto"
                  onChange={handleChange}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    dark:file:bg-blue-900/50 dark:file:text-blue-300
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/70"
                />
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:col-start-2"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="mt-3 sm:mt-0 w-full sm:col-start-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDebtorModal; 