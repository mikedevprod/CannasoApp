import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ConfigurarDB from "./components/ConfigurarDB";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/useAuthStore";

const Dashboard = () => {
  return <div>Bienvenido al Dashboard!</div>;
};

const App = () => {
  const [isPasswordSet, setIsPasswordSet] = useState(null);
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);

  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        const { data } = await axios.get("/api/check/check-db");
        setIsPasswordSet(data.isPasswordSet);
      } catch (err) {
        console.error("Error al comprobar el estado de la contraseña:", err);
      }
    };

    checkPasswordStatus();
  }, []);

  if (isPasswordSet === null) return <div>Cargando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige automáticamente según el estado de la contraseña */}
        <Route
          path="/"
          element={
            isPasswordSet ? <Navigate to="/login" /> : <Navigate to="/setup" />
          }
        />
        {/* Ruta para configurar la contraseña inicial */}
        <Route path="/setup" element={<ConfigurarDB />} />
        {/* Ruta para iniciar sesión - Solo si la contraseña está definida */}
        <Route
          path="/login"
          element={
            isPasswordSet ? (
              estaAutenticado ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login />
              )
            ) : (
              <Navigate to="/setup" />
            )
          }
        />
        {/* Ruta protegida para el dashboard */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
