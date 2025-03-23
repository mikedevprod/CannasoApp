import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const limpiarUsuario = useAuthStore((state) => state.limpiarUsuario);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      limpiarUsuario(); // Limpia el estado de Zustand
      navigate('/login'); // Redirige al login después de cerrar sesión
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <div>
      <h1>Bienvenido al Dashboard!</h1>
      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
