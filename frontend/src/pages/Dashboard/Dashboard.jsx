import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  FileText,
  Eye,
  Edit
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { formatCurrency, formatDate } from '../../utils/format';
import debtorService from '../../services/debtorService';
import debitService from '../../services/debitService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [recentDebtors, setRecentDebtors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all debtors
        const debtors = await debtorService.getAllDebtors();

        let totalOutstanding = 0;
        let totalPaymentsReceived = 0;
        let overdueAmount = 0;
        const allDebits = [];

        // Fetch debits for each debtor and calculate stats
        for (const debtor of debtors) {
          const debitsForDebtor = await debitService.getDebitsByDebtorId(debtor.id);
          allDebits.push(...debitsForDebtor);

          debitsForDebtor.forEach(debit => {
            const remaining = debit.debitAmount - (debit.totalRepayments || 0);
            totalOutstanding += remaining;
            totalPaymentsReceived += (debit.totalRepayments || 0);

            const isOverdue = new Date(debit.dueDate) < new Date() && remaining > 0;
            if (isOverdue) {
              overdueAmount += remaining;
            }
          });
        }

        // Calculate Stats
        const calculatedStats = [
          {
            title: 'Total Debtors',
            value: debtors.length.toString(),
            icon: Users,
            color: 'blue'
          },
          {
            title: 'Total Outstanding',
            value: formatCurrency(totalOutstanding),
            icon: DollarSign,
            color: 'green'
          },
          {
            title: 'Payments Received',
            value: formatCurrency(totalPaymentsReceived),
            icon: TrendingUp,
            color: 'purple'
          },
          {
            title: 'Overdue Amount',
            value: formatCurrency(overdueAmount),
            icon: AlertCircle,
            color: 'red'
          }
        ];
        setStats(calculatedStats);

        // Sort debtors by creation date (assuming newer debtors are at the end of the list)
        // and take the most recent ones.
        // NOTE: A proper backend endpoint for recent debtors would be more efficient.
        const sortedDebtors = [...debtors].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentDebtors(sortedDebtors.slice(0, 5)); // Show top 5 recent debtors

      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        setStats([]); // Clear stats on error
        setRecentDebtors([]); // Clear recent debtors on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  const statusStyles = {
    Active: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    Overdue: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    Paid: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  };

  // Function to determine debtor status based on their debits
  const getDebtorStatus = (debtorDebits) => {
      let hasOverdue = false;
      let hasActive = false; // Debits that are not paid and not overdue
      let hasPartiallyPaid = false;

      if (!debtorDebits || debtorDebits.length === 0) {
          return 'NO_DEBITS';
      }

      for (const debit of debtorDebits) {
          const remaining = debit.debitAmount - (debit.totalRepayments || 0);
          const isOverdue = new Date(debit.dueDate) < new Date() && remaining > 0;

          if (isOverdue) {
              hasOverdue = true;
          } else if (remaining > 0) {
              hasActive = true;
          } else if (debit.totalRepayments > 0 && remaining <= 0) {
              hasPartiallyPaid = true;
          }
      }

      if (hasOverdue) return 'Overdue';
      if (hasActive) return 'Active';
      if (hasPartiallyPaid) return 'Partially Paid'; // Consider if a debtor has some paid and some active debits

      // If no overdue, active, or partially paid debits, check if all are fully paid
      const allPaid = debtorDebits.every(debit => (debit.debitAmount - (debit.totalRepayments || 0)) <= 0);
      if (allPaid) return 'Paid';

      return 'Unknown'; // Should not reach here if logic is complete
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-4 sm:py-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-4 sm:py-6 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Dashboard </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full bg-${stat.color}-50 dark:bg-${stat.color}-900/50`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Debtors Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Debtors</h2>
          <button
            onClick={() => navigate(ROUTES.ADD_DEBTOR)}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Balance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentDebtors.map((debtor) => (
                <tr key={debtor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{debtor.debtorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatCurrency(debtor.totalBalance)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[getDebtorStatus(debtor.debits)]}`}>{getDebtorStatus(debtor.debits)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => navigate(`${ROUTES.DEBTORS}/${debtor.id}`)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4 inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentDebtors.length === 0 && (
             <div className="text-center px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                No recent debtors found.
              </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
           {recentDebtors.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No recent debtors found.
              </div>
           ) : (
            recentDebtors.map((debtor) => (
              <div key={debtor.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{debtor.debtorName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[getDebtorStatus(debtor.debits)]}`}>
                    {getDebtorStatus(debtor.debits)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Total Balance: {formatCurrency(debtor.totalBalance)}
                  </p>
                </div>
                <div className="mt-3 flex justify-end space-x-3">
                  <button
                    onClick={() => navigate(`${ROUTES.DEBTORS}/${debtor.id}`)}
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </div>
              </div>
            ))
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 