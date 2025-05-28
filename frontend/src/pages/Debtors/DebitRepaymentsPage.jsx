import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, RotateCcw } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/format';
import debitService from '../../services/debitService';
import repaymentService from '../../services/repaymentService';
import MessageAlert from '../../components/common/MessageAlert';
import AddRepaymentModal from '../../components/debtors/AddRepaymentModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const DebitRepaymentsPage = () => {
  const { id, debitId } = useParams();
  const navigate = useNavigate();
  const [debit, setDebit] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [isAddRepaymentModalOpen, setIsAddRepaymentModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'primary'
  });

  const fetchDebitDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [debits, repaymentsData] = await Promise.all([
        debitService.getDebitsByDebtorId(id),
        repaymentService.getRepaymentsForDebit(debitId)
      ]);
      
      const debitData = debits.find(d => d.id === parseInt(debitId));
      if (!debitData) {
        throw new Error('Debit not found');
      }
      
      setDebit(debitData);
      setRepayments(repaymentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebitDetails();
  }, [id, debitId]);

  const handleAddRepayment = async (repaymentData) => {
    try {
      const newRepayment = await repaymentService.createRepayment(debitId, repaymentData);
      setRepayments(prev => [...prev, newRepayment]);
      setDebit(prev => ({
        ...prev,
        totalRepayments: prev.totalRepayments + parseFloat(repaymentData.repaymentAmount)
      }));
      setIsAddRepaymentModalOpen(false);
      setAlert({
        show: true,
        message: 'Repayment added successfully',
        type: 'success'
      });
    } catch (err) {
      setAlert({
        show: true,
        message: err.message || 'Failed to add repayment',
        type: 'error'
      });
    }
  };

  const handleMarkAsPaid = async (repaymentId) => {
    try {
      const updatedRepayment = await repaymentService.markAsPaid(repaymentId);
      setRepayments(prev => 
        prev.map(repayment => 
          repayment.id === repaymentId ? updatedRepayment : repayment
        )
      );
      
      // Update debit data
      const debits = await debitService.getDebitsByDebtorId(id);
      const updatedDebit = debits.find(d => d.id === parseInt(debitId));
      if (updatedDebit) {
        setDebit(updatedDebit);
      }

      setAlert({
        show: true,
        message: 'Repayment marked as paid successfully',
        type: 'success'
      });
    } catch (err) {
      setAlert({
        show: true,
        message: err.message || 'Failed to mark repayment as paid',
        type: 'error'
      });
    }
  };

  const handleUndoPayment = async (repaymentId) => {
    try {
      const updatedRepayment = await repaymentService.undoPayment(repaymentId);
      setRepayments(prev => 
        prev.map(repayment => 
          repayment.id === repaymentId ? updatedRepayment : repayment
        )
      );
      
      // Update debit data
      const debits = await debitService.getDebitsByDebtorId(id);
      const updatedDebit = debits.find(d => d.id === parseInt(debitId));
      if (updatedDebit) {
        setDebit(updatedDebit);
      }

      setAlert({
        show: true,
        message: 'Payment status undone successfully',
        type: 'success'
      });
    } catch (err) {
      setAlert({
        show: true,
        message: err.message || 'Failed to undo payment status',
        type: 'error'
      });
    }
  };

  const showMarkAsPaidConfirmation = (repayment) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Mark as Paid',
      message: `Are you sure you want to mark the payment of ${formatCurrency(repayment.repaymentAmount)} as paid?`,
      onConfirm: () => {
        handleMarkAsPaid(repayment.id);
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
      variant: 'success'
    });
  };

  const showUndoPaymentConfirmation = (repayment) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Undo Payment',
      message: `Are you sure you want to undo the payment status of ${formatCurrency(repayment.repaymentAmount)}?`,
      onConfirm: () => {
        handleUndoPayment(repayment.id);
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
      variant: 'danger'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!debit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-600 dark:text-red-400">Debit not found</p>
        </div>
      </div>
    );
  }

  const remainingAmount = debit.debitAmount - (debit.totalRepayments || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {alert.show && (
        <MessageAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Debit Details</h1>
            <Button
              variant="primary"
              onClick={() => setIsAddRepaymentModalOpen(true)}
              disabled={remainingAmount <= 0}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Repayment
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
              <p className="text-lg text-gray-900 dark:text-white">{debit.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-lg text-gray-900 dark:text-white">{debit.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
              <p className="text-lg text-gray-900 dark:text-white">
                {debit.issueDate ? formatDate(debit.issueDate) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
              <p className="text-lg text-gray-900 dark:text-white">
                {debit.dueDate ? formatDate(debit.dueDate) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="text-lg text-gray-900 dark:text-white">{formatCurrency(debit.debitAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Repayments</p>
              <p className="text-lg text-gray-900 dark:text-white">{formatCurrency(debit.totalRepayments || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Amount</p>
              <p className={`text-lg font-semibold ${
                remainingAmount > 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {formatCurrency(remainingAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Repayment Schedule</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {repayments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No repayments scheduled yet
                    </td>
                  </tr>
                ) : (
                  repayments.map((repayment) => (
                    <tr key={repayment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(repayment.repaymentAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {repayment.repaymentDate ? formatDate(repayment.repaymentDate) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          repayment.paid
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                        }`}>
                          {repayment.paid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {!repayment.paid ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => showMarkAsPaidConfirmation(repayment)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark as Paid
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => showUndoPaymentConfirmation(repayment)}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Undo
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddRepaymentModal
        isOpen={isAddRepaymentModalOpen}
        onClose={() => setIsAddRepaymentModalOpen(false)}
        onSubmit={handleAddRepayment}
        remainingAmount={remainingAmount}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        variant={confirmationModal.variant}
      />
    </div>
  );
};

export default DebitRepaymentsPage; 