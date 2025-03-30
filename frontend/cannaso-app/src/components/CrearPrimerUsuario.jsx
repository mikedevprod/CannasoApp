import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/CrearPrimerUsuario.css";

const CrearPrimerUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [numeroSocio, setNumeroSocio] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [yaExisteUsuario, setYaExisteUsuario] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarUsuarios = async () => {
      try {
        const { data } = await axios.get("/api/socio/socios");
        if (data && data.length > 0) {
          setYaExisteUsuario(true);
          navigate("/login");
        }
      } catch (err) {
        console.error("Error verificando usuarios:", err);
      }
    };

    verificarUsuarios();
  }, [navigate]);

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
        rol: "admin",   // <- asignamos rol admin
      });

      navigate("/login");
    } catch (err) {
      console.error("Error al crear el usuario:", err);
      setError("No se pudo crear el usuario (¿ya existe ese número de socio?)");
    }
  };

  if (yaExisteUsuario) return null;

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
