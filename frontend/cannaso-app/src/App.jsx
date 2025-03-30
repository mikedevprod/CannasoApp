import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ConfigurarDB from "./components/ConfigurarDB";
import CrearPrimerUsuario from "./components/CrearPrimerUsuario";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/useAuthStore";
import DashboardPrincipal from "./pages/DashboardPrincipal";

const App = () => {
  const [isPasswordSet, setIsPasswordSet] = useState(null);
  const [hayUsuarios, setHayUsuarios] = useState(null);
  const [isVerificado, setIsVerificado] = useState(false);
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  const limpiarUsuario = useAuthStore((state) => state.limpiarUsuario);

  useEffect(() => {
    const checkEstadoInicial = async () => {
      try {
        const { data } = await axios.get("/api/check/check-db");
        setIsPasswordSet(data.isPasswordSet);
  
        if (data.isPasswordSet) {
          try {
            const usuarios = await axios.get("/api/socio/socios");
            setHayUsuarios(usuarios.data.length > 0);
          } catch (err) {
            console.warn("Error al obtener usuarios:", err);
            setHayUsuarios(false); // <- por defecto
          }
  
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
        } else {
          setHayUsuarios(false); // si no hay DB, tampoco hay usuarios
        }
      } catch (err) {
        console.error("Error al comprobar el estado inicial:", err);
      } finally {
        setIsVerificado(true);
      }
    };
  
    checkEstadoInicial();
  }, []);
  

  if (isPasswordSet === null || !isVerificado || hayUsuarios === null) {
    return <div>Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !isPasswordSet ? (
              <Navigate to="/setup" />
            ) : !hayUsuarios ? (
              <Navigate to="/crear-usuario" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/setup" element={<ConfigurarDB />} />
        <Route path="/crear-usuario" element={<CrearPrimerUsuario />} />
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute element={<DashboardPrincipal socioColaborador={setUsuario} />} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
