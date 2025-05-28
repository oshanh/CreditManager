import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { formatCurrency } from '../../utils/format';

const AddRepaymentModal = ({ isOpen, onClose, onSubmit, remainingAmount }) => {
  const [formData, setFormData] = useState({
    repaymentAmount: '',
    repaymentDate: new Date().toISOString().split('T')[0],
    notes: ''
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
      if (!formData.repaymentAmount || !formData.repaymentDate) {
        throw new Error('Please fill in all required fields');
      }

      const amount = parseFloat(formData.repaymentAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (amount > remainingAmount) {
        throw new Error(`Amount cannot exceed remaining balance of ${formatCurrency(remainingAmount)}`);
      }

      await onSubmit({
        ...formData,
        repaymentAmount: amount
      });

      // Reset form
      setFormData({
        repaymentAmount: '',
        repaymentDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
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
      title="Add Repayment"
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
            name="repaymentAmount"
            value={formData.repaymentAmount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
            min="0"
            step="0.01"
            max={remainingAmount}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Remaining balance: {formatCurrency(remainingAmount)}
          </p>
        </div>

        <div>
          <Input
            label="Date"
            type="date"
            name="repaymentDate"
            value={formData.repaymentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Input
            label="Notes"
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional notes about this repayment"
          />
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
            isLoading={loading}
          >
            Add Repayment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRepaymentModal; 