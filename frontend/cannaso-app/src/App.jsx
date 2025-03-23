import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ConfigurarDB from "./components/ConfigurarDB";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/useAuthStore";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [isPasswordSet, setIsPasswordSet] = useState(null);
  const [isVerificado, setIsVerificado] = useState(false);
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);

  // Comprobar si la contraseña de la DB está configurada
  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        const { data } = await axios.get("/api/check/check-db");
        setIsPasswordSet(data.isPasswordSet);
  
        if (data.isPasswordSet) {
          try {
            // Verificar el token para restaurar el estado de sesión
            const { data } = await axios.get("/api/auth/verificar-token");
            if (data.message === "Token Verificado") {
              setUsuario({ nombre: data.nombre, rol: data.rol });
            }
          } catch (err) {
            console.warn("Token inválido o sesión caducada");
            limpiarUsuario(); // <-- Limpia el estado si no hay token
          }
        }
      } catch (err) {
        console.error("Error al comprobar el estado de la contraseña:", err);
      } finally {
        setIsVerificado(true);
      }
    };
  
    checkPasswordStatus();
  }, []);
  

  // Mostrar un loader mientras se verifica el estado de autenticación
  if (isPasswordSet === null || !isVerificado) return <div>Cargando...</div>;

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
