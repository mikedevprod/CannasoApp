import React, { useState } from "react";
import "./styles/ModalAñadirUsuario.css";
import axios from "axios";

export default function ModalAñadirUsuario({ onClose, onUsuarioCreado }) {
  const [nombre, setNombre] = useState("");
  const [numeroSocio, setNumeroSocio] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("comun");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !numeroSocio || ((rol === "admin" || rol === "colaborador") && !password)) {
      setError("Todos los campos obligatorios deben estar completos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("numeroSocio", numeroSocio);
    formData.append("emitirToken", "false");

    formData.append("rol", rol);
    if (rol !== "comun") formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (onUsuarioCreado) onUsuarioCreado();
      onClose();
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      setError("Error al crear usuario.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Añadir Nuevo Usuario</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Nombre completo:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Número de socio:</label>
          <input
            type="text"
            value={numeroSocio}
            onChange={(e) => setNumeroSocio(e.target.value)}
          />

          <label>Rol:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="comun">Socio Común</option>
            <option value="colaborador">Socio Colaborador</option>
            <option value="admin">Administrador</option>
          </select>

          {(rol === "admin" || rol === "colaborador") && (
            <>
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          <label>Foto de perfil:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <div className="modal-actions">
            <button type="submit">Crear Usuario</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
