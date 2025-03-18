import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfigurarDB from './components/ConfigurarDB';

const App = () => {
  const [isPasswordSet, setIsPasswordSet] = useState(null);

  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        const { data } = await axios.get('/api/check/check-db');
        setIsPasswordSet(data.isPasswordSet);
      } catch (err) {
        console.error('Error al comprobar el estado de la contraseña:', err);
      }
    };

    checkPasswordStatus();
  }, []);

  if (isPasswordSet === null) return <div>Cargando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige automáticamente según el estado de la contraseña */}
        <Route path="/" element={isPasswordSet ? <Navigate to="/login" /> : <Navigate to="/setup" />} />
        {/* Ruta para configurar la contraseña inicial */}
        <Route path="/setup" element={<ConfigurarDB />} />
        {/* Aquí añadiremos la ruta para login y dashboard más adelante */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;