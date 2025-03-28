import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore.js';

const Login = () => {
  const [numeroSocio, setNumeroSocio] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUsuario = useAuthStore((state) => state.setUsuario);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!numeroSocio || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/auth/login',
        { numeroSocio, password },
        { withCredentials: true }
      );

      setUsuario({ nombre: data.nombre, numeroSocio: data.numeroSocio, rol: data.rol });
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Número de socio"
          value={numeroSocio}
          onChange={(e) => setNumeroSocio(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
