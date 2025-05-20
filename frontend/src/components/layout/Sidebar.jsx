import { useState, useEffect, useRef } from 'react';
import { Link, useLocation ,useNavigate} from 'react-router-dom';
import { 
  Home, 
  Users, 
  DollarSign, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  BarChart2,
  Menu,
  Bell,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/authService';
import useClickOutside from '../../hooks/useClickOutside';


const Sidebar = ({ isOpen, onClose, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();

  // Refs for handling outside clicks
  const userMenuButtonRef = useRef(null); // Add ref for the user menu button

  const navigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: Home },
    { name: 'Debtors', href: ROUTES.DEBTORS, icon: Users },
    { name: 'Transactions', href: ROUTES.TRANSACTIONS, icon: DollarSign },
    { name: 'Reports', href: ROUTES.REPORTS, icon: BarChart2 },
    { name: 'Documents', href: ROUTES.DOCUMENTS, icon: FileText },
    
   
  ];

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Use the custom hook to close the user menu on outside clicks
  const userMenuRef = useClickOutside(() => {
    setIsUserMenuOpen(false);
  }, [userMenuButtonRef]); // Pass the button ref to exclude

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => onClose(!isOpen)}
          className=" rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          {!isOpen ?
              <ChevronRight className="h-8 w-8" />:
              <ChevronLeft className="h-8 w-8" />
              }
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => onClose(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex-shrink-0 flex items-center h-16 px-2 ml-2 border-b border-gray-200 dark:border-gray-700">
            {/* Collapse Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className=" rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-2 hidden lg:flex"
            >
              {isCollapsed ?
              <ChevronRight className=" h-8 w-8" />:
              <ChevronLeft className=" h-8 w-8" />
              }
            </button>
            {!isCollapsed && (
              isOpen ?
              <h1 className="ml-9 text-2xl font-bold text-gray-900 dark:text-white">Debit Manager</h1>:
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Debit Manager</h1>

            )}
          </div>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Navigation */}
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isActive ? 'text-blue-600 dark:text-blue-200' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      }`}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 