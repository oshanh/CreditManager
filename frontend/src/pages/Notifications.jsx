import React, { useState, useEffect } from 'react';
import debitService from '../services/debitService';

const Notifications = () => {
  const [overdueDebits, setOverdueDebits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverdueDebits = async () => {
      try {
        const data = await debitService.getOverdueDebits();
        setOverdueDebits(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch overdue debits');
        setLoading(false);
      }
    };

    fetchOverdueDebits();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading overdue debits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Overdue Debits</h1>
      </div>
      
      {overdueDebits.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-gray-600 dark:text-gray-400">No overdue debits found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {overdueDebits.map((debit) => {
            const remainingAmount = debitService.calculateRemainingBalance(debit);
            
            return (
              <div 
                key={debit.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{debit.debtorName}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      {debit.daysOverdue} days overdue
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Remaining Amount:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">${remainingAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{new Date(debit.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{debitService.getDebitStatus(debit)}</span>
                    </div>
                    {debit.description && (
                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">{debit.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications; 