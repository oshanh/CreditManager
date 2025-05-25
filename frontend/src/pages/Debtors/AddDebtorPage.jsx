import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddDebtorForm from '../../components/debtors/AddDebtorForm';
import Button from '../../components/common/Button';
import MessageAlert from '../../components/common/MessageAlert';

const AddDebtorPage = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleSuccess = (data) => {
    setAlert({
      type: 'success',
      message: 'Debtor added successfully!'
    });
    
    // Navigate back to debtors list after 2 seconds
    setTimeout(() => {
      navigate('/debtors');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {alert && (
        <MessageAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={2000}
        />
      )}
      
      <div className="mb-6 flex items-center">
        <Button
          variant="secondary"
          onClick={() => navigate('/debtors')}
          className="mr-4"
        >
          Back to Debtors
        </Button>
      </div>
      <AddDebtorForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AddDebtorPage; 