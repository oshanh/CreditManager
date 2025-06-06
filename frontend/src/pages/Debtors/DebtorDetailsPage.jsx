import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Receipt, Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/format';
import debtorService from '../../services/debtorService';
import debitService from '../../services/debitService';
import MessageAlert from '../../components/common/MessageAlert';
import AddDebitModal from '../../components/debtors/AddDebitModal';

const DebtorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debtor, setDebtor] = useState(null);
  const [debits, setDebits] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('debits');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [isAddDebitModalOpen, setIsAddDebitModalOpen] = useState(false);

  useEffect(() => {
    const fetchDebtorDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const [debtorData, debitsData] = await Promise.all([
          debtorService.getDebtorById(id),
          debitService.getDebitsByDebtorId(id)
        ]);
        setDebtor(debtorData);
        setDebits(debitsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDebtorDetails();
  }, [id]);

  const handleAddDebit = async (debitData) => {
    try {
      const newDebit = await debitService.createDebit({
        ...debitData,
        debtorId: id
      });
      setDebits(prev => [...prev, newDebit]);
      setAlert({
        show: true,
        message: 'Debit added successfully',
        type: 'success'
      });
    } catch (err) {
      setAlert({
        show: true,
        message: err.message || 'Failed to add debit',
        type: 'error'
      });
    }
  };

  const renderProfileImage = (debtor) => {
    if (!debtor?.profilePhotoPath) {
      return (
        <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span className="text-2xl font-bold">{debtor?.debtorName?.charAt(0) || '?'}</span>
        </div>
      );
    }

    return (
      <div className="h-16 w-16 rounded-full overflow-hidden">
        <img
          src={debtorService.getSecureFileUrl(debtor.profilePhotoPath)}
          alt={debtor.debtorName}
          className="h-full w-full object-cover"
          onError={(e) => {
            const parent = e.target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <span class="text-2xl font-bold">${debtor?.debtorName?.charAt(0) || '?'}</span>
                </div>
              `;
            }
          }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

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
          onClick={() => navigate('/debtors')}
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Debtors
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
          {renderProfileImage(debtor)}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{debtor.debtorName}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{debtor.email}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'debits' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('debits')}
              className="flex items-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Debits
            </Button>
            {/* <Button
              variant={activeTab === 'transactions' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('transactions')}
              className="flex items-center"
            >
              <Receipt className="w-5 h-5 mr-2" />
              Transactions
            </Button> */}
          </div>
          {activeTab === 'debits' && (
            <Button
              variant="primary"
              onClick={() => setIsAddDebitModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Debit
            </Button>
          )}
        </div>
      </div>

      {activeTab === 'debits' ? (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          {/* Mobile View */}
          <div className="block sm:hidden">
            {debits.map((debit) => {
              const remainingAmount = debitService.calculateRemainingBalance(debit);
              const status = debitService.getDebitStatus(debit);
              return (
                <div
                  key={debit.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  onClick={() => navigate(`/debtors/${id}/debits/${debit.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatCurrency(debit.debitAmount)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      status === 'OVERDUE'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                        : status === 'PARTIALLY_PAID'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                          : status === 'PAID'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400'
                    }`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {debit.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        debit.type === 'DAILY'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                          : debit.type === 'WEEKLY'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-400'
                      }`}>
                        {debit.type}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(debit.issueDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(debit.dueDate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Balance</p>
                    <p className={`text-sm font-medium ${
                      remainingAmount > 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {formatCurrency(remainingAmount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remaining Balance</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {debits.map((debit) => {
                      const remainingAmount = debitService.calculateRemainingBalance(debit);
                      const status = debitService.getDebitStatus(debit);
                      return (
                        <tr 
                          key={debit.id} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                          onClick={() => navigate(`/debtors/${id}/debits/${debit.id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(debit.debitAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {debit.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(debit.issueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(debit.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              debit.type === 'DAILY'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                                : debit.type === 'WEEKLY'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400'
                                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-400'
                            }`}>
                              {debit.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={`${
                              remainingAmount > 0 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-green-600 dark:text-green-400'
                            }`}>
                              {formatCurrency(remainingAmount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              status === 'OVERDUE'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                                : status === 'PARTIALLY_PAID'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                                  : status === 'PAID'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400'
                            }`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          {/* Mobile View */}
          <div className="block sm:hidden">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === 'IN'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                  }`}>
                    {transaction.type}
                  </span>
                </div>

                <div className="mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {transaction.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === 'IN'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddDebitModal
        isOpen={isAddDebitModalOpen}
        onClose={() => setIsAddDebitModalOpen(false)}
        onSubmit={handleAddDebit}
        debtorId={id}
      />
    </div>
  );
};

export default DebtorDetailsPage; 