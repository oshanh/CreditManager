import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, RotateCcw, Download, Pen, X } from 'lucide-react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/format';
import debitService from '../../services/debitService';
import repaymentService from '../../services/repaymentService';
import debtorService from '../../services/debtorService';
import MessageAlert from '../../components/common/MessageAlert';
import AddRepaymentModal from '../../components/debtors/AddRepaymentModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import DebitPDFTemplate from '../../components/debtors/DebitPDFTemplate';

// Add polyfills for PDF generation
if (typeof window !== 'undefined') {
  import('buffer').then(({ Buffer }) => {
    window.Buffer = Buffer;
  });
}

const DebitRepaymentsPage = () => {
  const { id, debitId } = useParams();
  const navigate = useNavigate();
  const [debit, setDebit] = useState(null);
  const [debtor, setDebtor] = useState(null);
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
  const [signature, setSignature] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const fetchDebitDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [debits, repaymentsData, debtorData] = await Promise.all([
        debitService.getDebitsByDebtorId(id),
        repaymentService.getRepaymentsForDebit(debitId),
        debtorService.getDebtorById(id)
      ]);
      
      const debitData = debits.find(d => d.id === parseInt(debitId));
      if (!debitData) {
        throw new Error('Debit not found');
      }
      
      setDebit(debitData);
      setRepayments(repaymentsData);
      setDebtor(debtorData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebitDetails();
  }, [id, debitId]);

  useEffect(() => {
    if (showSignaturePad && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;

      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context.lineCap = 'round';
      context.strokeStyle = '#000000';
      context.lineWidth = 2;
      contextRef.current = context;
    }
  }, [showSignaturePad]);

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

  const startDrawing = ({ nativeEvent }) => {
    if (!contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const saveSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    setSignature(signatureData);
    setShowSignaturePad(false);
  };

  const handleDownloadPDF = async () => {
    
    try {
      const blob = await pdf(
        <DebitPDFTemplate 
          debtor={debtor} 
          debit={debit} 
          repayments={repayments} 
          signature={signature} 
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `debit-report-${debitId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setAlert({
        show: true,
        message: 'Failed to generate PDF. Please try again.',
        type: 'error'
      });
    }
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
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {alert.show && (
        <MessageAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      <div className="mb-4 sm:mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Debit Details</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="primary"
                onClick={() => setIsAddRepaymentModalOpen(true)}
                disabled={remainingAmount <= 0}
                className="flex-1 sm:flex-none"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Repayment
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowSignaturePad(true)}
                className="flex-1 sm:flex-none"
              >
                <Pen className="w-5 h-5 mr-2" />
                {signature ? 'Change Signature' : 'Add Signature'}
              </Button>
              {debtor && debit && (
                <Button
                  variant="secondary"
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
              <p className="text-base sm:text-lg text-gray-900 dark:text-white break-words">{debit.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-base sm:text-lg text-gray-900 dark:text-white">{debit.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
              <p className="text-base sm:text-lg text-gray-900 dark:text-white">
                {debit.issueDate ? formatDate(debit.issueDate) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
              <p className="text-base sm:text-lg text-gray-900 dark:text-white">
                {debit.dueDate ? formatDate(debit.dueDate) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="text-base sm:text-lg text-gray-900 dark:text-white">{formatCurrency(debit.debitAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Repayments</p>
              <p className="text-base sm:text-lg text-gray-900 dark:text-white">{formatCurrency(debit.totalRepayments || 0)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Amount</p>
              <p className={`text-base sm:text-lg font-semibold ${
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
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Repayment Schedule</h2>
          </div>

          {/* Mobile View */}
          <div className="block sm:hidden">
            {repayments.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No repayments scheduled yet
              </div>
            ) : (
              repayments.map((repayment) => (
                <div
                  key={repayment.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatCurrency(repayment.repaymentAmount)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      repayment.paid
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                    }`}>
                      {repayment.paid ? 'Paid' : 'Pending'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {repayment.repaymentDate ? formatDate(repayment.repaymentDate) : 'N/A'}
                    </p>
                  </div>

                  <div>
                    {!repayment.paid ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => showMarkAsPaidConfirmation(repayment)}
                        className="w-full"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark as Paid
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => showUndoPaymentConfirmation(repayment)}
                        className="w-full"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Undo
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
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

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Signature</h3>
              <button
                onClick={() => setShowSignaturePad(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={finishDrawing}
                onMouseLeave={finishDrawing}
                className="w-full h-48 bg-white dark:bg-gray-700 rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={clearSignature}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                onClick={saveSignature}
              >
                Save Signature
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebitRepaymentsPage; 