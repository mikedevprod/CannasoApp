import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CrearPrimerUsuario from "./components/CrearPrimerUsuario";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/useAuthStore";
import DashboardPrincipal from "./pages/DashboardPrincipal";

const App = () => {
  const [hayUsuarios, setHayUsuarios] = useState(null);
  const [isVerificado, setIsVerificado] = useState(false);

  const setUsuario = useAuthStore((state) => state.setUsuario);
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  const limpiarUsuario = useAuthStore((state) => state.limpiarUsuario);

  useEffect(() => {
    const checkEstadoInicial = async () => {
      try {
        const usuarios = await axios.get("/api/socio/socios");
        setHayUsuarios(usuarios.data.length > 0);

        try {
          const { data } = await axios.get("/api/auth/verificar-token", {
            withCredentials: true,
          });

          if (data.message === "Token Verificado") {
            setUsuario({
              nombre: data.nombre,
              numeroSocio: data.numeroSocio,
              rol: data.rol,
            });
          }
        } catch (err) {
          console.warn("Token inválido o sesión caducada");
          limpiarUsuario();
        }
      } catch (err) {
        console.error("Error al comprobar usuarios:", err);
        setHayUsuarios(false);
      } finally {
        setIsVerificado(true);
      }
    };

    checkEstadoInicial();
  }, []);

  if (!isVerificado || hayUsuarios === null) {
    return <div>Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !hayUsuarios ? (
              <Navigate to="/crear-usuario" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/crear-usuario" element={<CrearPrimerUsuario />} />
        <Route
          path="/login"
          element={
            estaAutenticado ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardPrincipal />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
