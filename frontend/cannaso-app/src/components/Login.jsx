import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import "./styles/Login.css";

const Login = () => {
  const [numeroSocio, setNumeroSocio] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUsuario = useAuthStore((state) => state.setUsuario);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!numeroSocio || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { numeroSocio, password },
        { withCredentials: true }
      );

      setUsuario({
        nombre: data.nombre,
        numeroSocio: data.numeroSocio,
        rol: data.rol,
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Iniciar Sesión</h1>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              placeholder="Número de socio"
              value={numeroSocio}
              onChange={(e) => setNumeroSocio(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-button">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
