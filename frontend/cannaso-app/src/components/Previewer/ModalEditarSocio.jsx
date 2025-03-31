import React, { useState } from "react";
import "./styles/ModalEditarSocio.css";
import axios from "axios";

export default function ModalEditarSocio({ perfil, setPerfiles, onClose }) {
  const [formData, setFormData] = useState({
    nombre: perfil.nombre,
    numeroSocio: perfil.numeroSocio,
    foto: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    if (formData.foto) {
      formDataToSend.append("avatar", formData.foto); // campo que reconoce multer
    }

    try {
      const response = await axios.put(
        `/api/socio/socios/${perfil._id}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      

      setPerfiles((prevPerfiles) =>
        prevPerfiles.map((p) =>
          p._id === perfil._id ? { ...p, ...response.data } : p
        )
      );
      onClose();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          Editar Socio -{" "}
          <span style={{ color: "orange" }}>
            <i>Socio Nº{perfil.numeroSocio}</i>
          </span>
        </h2>
        <form onSubmit={handleSubmit} className="form-editar-socio">
          <div className="containerInputForm">
            <label>Nombre:</label>
            <input
              className="inputFormEditarSocio"
              type="text"
              name="nombre"
              value={perfil.nombre}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="containerInputForm">
            <label>Foto:</label>
            <input
              className="inputFormEditarSocio"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
