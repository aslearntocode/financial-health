import { useNavigate } from 'react-router-dom';

function MFDashboard() {
  const navigate = useNavigate();
  
  return (
    <div>
      <button 
        onClick={() => navigate('/investment')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Back to Investment
      </button>
    </div>
  );
}

export default MFDashboard; 