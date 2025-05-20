import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatCurrency, formatPhoneNumber } from '../../utils/format';
import debtorService from '../../services/debtorService';
import useDebounce from '../../hooks/useDebounce';

const API_BASE_URL = 'http://localhost:8081';

const DebtorsPage = () => {
  const navigate = useNavigate();
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await debtorService.getAllDebtors();
        setDebtors(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDebtors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this debtor?')) {
      try {
        await debtorService.deleteDebtor(id);
        setDebtors(debtors.filter(debtor => debtor.id !== id));
      } catch (err) {
        setError('Failed to delete debtor');
        console.error('Error deleting debtor:', err);
      }
    }
  };

  const filteredDebtors = debtors.filter(debtor => 
    debtor.debtorName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    debtor.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    debtor.contactNumber.includes(debouncedSearchTerm)
  );

  const renderProfileImage = (debtor) => {
    if (!debtor.profilePhotoPath) {
      return (
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span className="text-lg font-bold">{debtor.debtorName?.charAt(0) || '?'}</span>
        </div>
      );
    }

    return (
      <div className="h-10 w-10 rounded-full overflow-hidden">
        <img
          src={debtorService.getSecureFileUrl(debtor.profilePhotoPath)}
          alt={debtor.debtorName}
          className="h-full w-full object-cover"
          onError={(e) => {
            const parent = e.target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <span class="text-lg font-bold">${debtor.debtorName?.charAt(0) || '?'}</span>
                </div>
              `;
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Debtors</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/debtors/add')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Debtor
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search debtors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[64px]" style={{width: '64px'}}>Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[180px]" style={{width: '180px'}}>Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[140px]" style={{width: '140px'}}>Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[240px]" style={{width: '240px'}}>Address</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[120px]" style={{width: '120px'}}>Total Credit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]" style={{width: '100px'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDebtors.map((debtor) => (
                  <tr key={debtor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap w-[64px]" style={{width: '64px'}}>
                      {renderProfileImage(debtor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white w-[180px]" style={{width: '180px'}}>{debtor.debtorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 w-[140px]" style={{width: '140px'}}>{formatPhoneNumber(debtor.contactNumber)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 w-[240px]" style={{width: '240px'}}>{debtor.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white w-[120px]" style={{width: '120px'}}>{formatCurrency(debtor.totalBalance)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-[100px]" style={{width: '100px'}}>
                      <button
                        onClick={() => navigate(`/debtors/${debtor.id}/edit`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(debtor.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtorsPage; 