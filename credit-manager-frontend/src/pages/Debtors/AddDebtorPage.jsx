import { useNavigate } from 'react-router-dom';
import AddDebtorForm from '../../components/debtors/AddDebtorForm';
import Button from '../../components/common/Button';

const AddDebtorPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (data) => {
    // You could add a toast notification here
    console.log('Debtor added successfully:', data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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