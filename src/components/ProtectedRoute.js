import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// Wrap a page with this to make it available only to logged in users
function ProtectedRoute({ children }) {
  const { user } = useAppContext();

  // Not logged in: send the user to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in: show the page
  return children;
}

export default ProtectedRoute;
