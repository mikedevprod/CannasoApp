// src/components/CrearPrimerUsuario.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/CrearPrimerUsuario.css";

const CrearPrimerUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [numeroSocio, setNumeroSocio] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !numeroSocio || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      await axios.post("/api/auth/register", {
        nombre,
        numeroSocio,
        password,
        rol: "admin", // 👈 aquí está el problema
      });
      
      navigate("/login");
    } catch (err) {
      console.error("Error al crear el usuario:", err);
      setError("No se pudo crear el usuario");
    }
  };

  return (
    <div className="crear-usuario-page">
      <div className="crear-usuario-container">
        <h1>Crea el primer Socio Colaborador</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Número de socio"
            value={numeroSocio}
            onChange={(e) => setNumeroSocio(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Crear Usuario</button>
        </form>
      </div>
    </div>
  );
};

export default CrearPrimerUsuario;
