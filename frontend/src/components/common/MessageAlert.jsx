import { X } from 'lucide-react';
import { useEffect } from 'react';

const alertStyles = {
  success: {
    container: 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    icon: 'text-green-400 dark:text-green-300',
    closeButton: 'text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/50'
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    icon: 'text-red-400 dark:text-red-300',
    closeButton: 'text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/50'
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: 'text-yellow-400 dark:text-yellow-300',
    closeButton: 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800/50'
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    icon: 'text-blue-400 dark:text-blue-300',
    closeButton: 'text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50'
  }
};

const MessageAlert = ({
  type = 'info',
  message,
  onClose,
  duration = 5000,
  className = ''
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = alertStyles[type] || alertStyles.info;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out translate-x-0 ${className}`}
      role="alert"
    >
      <div
        className={`relative rounded-lg border p-4 shadow-lg ${styles.container} animate-slide-in`}
      >
        <div className="flex items-start">
          <div className="flex-1">
            <p className={`text-sm font-medium ${styles.text}`}>
              {message}
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              className={`ml-4 inline-flex flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.closeButton}`}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageAlert; 