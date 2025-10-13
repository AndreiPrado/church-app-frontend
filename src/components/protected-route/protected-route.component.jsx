import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';
import LoadingSpinner from '../loading-spinner/loading-spinner.component';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('ProtectedRoute - loading:', loading, 'isAuthenticated:', isAuthenticated(), 'user:', user); // Debug

  if (loading) {
    console.log('ProtectedRoute - ainda carregando...'); // Debug
    return <LoadingSpinner message="Carregando..." />;
  }

  if (!isAuthenticated()) {
    console.log('ProtectedRoute - não autenticado, redirecionando para /login'); // Debug
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - autenticado, renderizando children'); // Debug
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
