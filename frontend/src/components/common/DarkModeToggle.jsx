import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-lg bg-gray-800 dark:bg-gray-700 text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default DarkModeToggle; 