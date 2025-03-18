import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ element }) => {
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);

  if (!estaAutenticado) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
