import { useState } from 'react';
import MessageAlert from './MessageAlert';

const MessageAlertDemo = () => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => addAlert('success', 'Operation completed successfully!')}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Show Success
        </button>
        <button
          onClick={() => addAlert('error', 'An error occurred. Please try again.')}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Show Error
        </button>
        <button
          onClick={() => addAlert('warning', 'Please review your information before proceeding.')}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Show Warning
        </button>
        <button
          onClick={() => addAlert('info', 'Here is some important information.')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Show Info
        </button>
      </div>

      <div className="space-y-2">
        {alerts.map(alert => (
          <MessageAlert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageAlertDemo; 