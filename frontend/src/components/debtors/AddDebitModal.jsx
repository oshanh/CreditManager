import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const AddDebitModal = ({ isOpen, onClose, onSubmit, debtorId }) => {
  const [formData, setFormData] = useState({
    debitAmount: '',
    description: '',
    issueDate: '',
    dueDate: '',
    type: 'MONTHLY'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.debitAmount || !formData.description || !formData.issueDate || !formData.dueDate) {
        throw new Error('Please fill in all required fields');
      }

      // Convert amount to number
      const debitData = {
        ...formData,
        debitAmount: parseFloat(formData.debitAmount),
        debtor: { id: debtorId }
      };

      await onSubmit(debitData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Debit"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div>
          <Input
            label="Amount"
            type="number"
            name="debitAmount"
            value={formData.debitAmount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
        </div>

        <div>
          <Input
            label="Issue Date"
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Input
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </Select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Debit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDebitModal; 