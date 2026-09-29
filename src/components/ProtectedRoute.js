import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function ProtectedRoute({ children }) {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
