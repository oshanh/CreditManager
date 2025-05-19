import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useUser } from '../context/UserContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleGo = () => {
    if (user && user.token) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-full px-4 py-2 text-xs font-semibold mb-4">Welcome to</span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Debit Manager</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Effortlessly manage your debtors, track outstanding payments, and stay organized with a modern dashboard.
          </p>
        </div>
        <button
          onClick={handleGo}
          className="w-full py-3 px-6 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Welcome; 