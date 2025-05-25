import { useState } from 'react';
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
import { formatCurrency } from '../../utils/format';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual data from your API
  const stats = [
    {
      title: 'Total Debtors',
      value: '12',
      change: '+2',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Outstanding',
      value: formatCurrency(5240),
      change: '+$320',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Payments Received',
      value: formatCurrency(1875),
      change: '+$450',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Overdue Amount',
      value: formatCurrency(920),
      change: '-$125',
      icon: AlertCircle,
      color: 'red'
    }
  ];

  const recentDebtors = [
    { name: 'John Smith', amount: 850, status: 'Active', due: '2025-06-15' },
    { name: 'Sarah Johnson', amount: 1200, status: 'Overdue', due: '2025-05-10' },
    { name: 'Michael Brown', amount: 650, status: 'Active', due: '2025-06-22' },
    { name: 'Emily Davis', amount: 320, status: 'Paid', due: '2025-05-05' },
    { name: 'Robert Wilson', amount: 975, status: 'Active', due: '2025-06-30' },
    { name: 'John Smith', amount: 850, status: 'Active', due: '2025-06-15' },
    { name: 'Sarah Johnson', amount: 1200, status: 'Overdue', due: '2025-05-10' },
    { name: 'Michael Brown', amount: 650, status: 'Active', due: '2025-06-22' },
    { name: 'Emily Davis', amount: 320, status: 'Paid', due: '2025-05-05' },
    { name: 'Robert Wilson', amount: 975, status: 'Active', due: '2025-06-30' },
    { name: 'John Smith', amount: 850, status: 'Active', due: '2025-06-15' },
    { name: 'Sarah Johnson', amount: 1200, status: 'Overdue', due: '2025-05-10' },
    { name: 'Michael Brown', amount: 650, status: 'Active', due: '2025-06-22' },
    { name: 'Emily Davis', amount: 320, status: 'Paid', due: '2025-05-05' },
    { name: 'Robert Wilson', amount: 975, status: 'Active', due: '2025-06-30' },
    { name: 'John Smith', amount: 850, status: 'Active', due: '2025-06-15' },
    { name: 'Sarah Johnson', amount: 1200, status: 'Overdue', due: '2025-05-10' },
    { name: 'Michael Brown', amount: 650, status: 'Active', due: '2025-06-22' },
    { name: 'Emily Davis', amount: 320, status: 'Paid', due: '2025-05-05' },
    { name: 'Robert Wilson', amount: 975, status: 'Active', due: '2025-06-30' },
    { name: 'John Smith', amount: 850, status: 'Active', due: '2025-06-15' },
    { name: 'Sarah Johnson', amount: 1200, status: 'Overdue', due: '2025-05-10' },
    { name: 'Michael Brown', amount: 650, status: 'Active', due: '2025-06-22' },
    { name: 'Emily Davis', amount: 320, status: 'Paid', due: '2025-05-05' },
    { name: 'Robert Wilson', amount: 975, status: 'Active', due: '2025-06-30' },

    
    
    
    
  ];

  const statusStyles = {
    Active: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    Overdue: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    Paid: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Dashboard..!</h1>
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
            <div className="mt-3 sm:mt-4">
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
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
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentDebtors.slice(0, 5).map((debtor, idx) => (
                <tr key={debtor.name + idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{debtor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatCurrency(debtor.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[debtor.status]}`}>{debtor.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{debtor.due}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4">View</button>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {recentDebtors.slice(0, 5).map((debtor, idx) => (
            <div key={debtor.name + idx} className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{debtor.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[debtor.status]}`}>
                  {debtor.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Amount: {formatCurrency(debtor.amount)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Due: {debtor.due}
                </p>
              </div>
              <div className="mt-3 flex justify-end space-x-3">
                <button className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 