import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ConfigurarDB.css'

const ConfigurarDB = () => {
  const [password, setPassword] = useState('');
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        const { data } = await axios.get('/api/check/check-db');
        setIsPasswordSet(data.isPasswordSet);

        if (data.isPasswordSet) {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error al comprobar el estado de la contraseña:', err);
      } finally {
        setLoading(false);
      }
    };

    checkPasswordStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError('La contraseña es obligatoria');
      return;
    }

    try {
      await axios.post('/api/setup/setup-db', { password });
      navigate('/login');
    } catch (err) {
      console.error('Error al configurar la contraseña:', err);
      setError('Error al configurar la contraseña');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="configurarDB_page">
      <h1 className="text-2xl font-bold mb-4">¡Bienvenido a Cannaso!</h1>
      <h2>Empecemos con la configuración...</h2>
      <h3>Crea una contraseña para tu base de datos y manen los datos a salvo.</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="password"
          placeholder="Introduce una contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Guardar Contraseña
        </button>
      </form>
    </div>
  );
};

export default ConfigurarDB;
