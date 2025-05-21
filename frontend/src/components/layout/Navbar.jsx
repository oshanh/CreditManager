import { useState, useRef, useCallback } from 'react';
import { Menu, X, Bell, Search, Sun, Moon } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import useClickOutside from '../../hooks/useClickOutside';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import PropTypes from 'prop-types';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Refs for handling outside clicks on the user menu
  const userMenuRef = useRef(null);
  const userMenuButtonRef = useRef(null);

  // Use the custom hook to close the user menu on outside clicks
  useClickOutside(() => {
    setIsUserMenuOpen(false);
  }, [userMenuRef, userMenuButtonRef]); // Exclude clicks on the menu and the button

  // Handle logout
  const handleLogout = useCallback(() => {
    authService.logout();
    logout();
    navigate(ROUTES.LOGIN);
  }, [logout, navigate]);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo or brand name can go here */}
          </div>

          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
              <Bell className="h-6 w-6" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ml-3"
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>

            

            <div className="ml-3 relative">
              <div>
                <button
                  ref={userMenuButtonRef}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.nickname?.charAt(0) || 'U'}
                    </span>
                  </div>
                </button>
              </div>

              {isUserMenuOpen && (
                <div 
                  ref={userMenuRef}
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-medium">{user?.nickname || 'User'}</p>
                    <p className="text-gray-500 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile sidebar toggle button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 ml-3 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired
};

export default Navbar; 