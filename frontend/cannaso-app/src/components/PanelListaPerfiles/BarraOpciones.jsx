import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import "./styles/BarraOpciones.css";

import iconoAddUser from "../../assets/icons/agregar-usuario.png";
import iconoLogout from "../../assets/icons/cerrar-sesion.png";
import iconoPDF from "../../assets/icons/pdf.png";

import ModalAñadirUsuario from "./ModalAñadirUsuario.jsx";

export default function BarraOpciones({ setDashboardSeleccionado, perfilColaborador }) {
  const navigate = useNavigate();
  const limpiarUsuario = useAuthStore((state) => state.limpiarUsuario);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      limpiarUsuario();
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const handleSeleccionarDashboard = () => {
    setDashboardSeleccionado((prev) => !prev);
  };

  return (
    <div id="barra_opciones">
      <h2>Bienvenido, {perfilColaborador.nombre}</h2>
      <div className="barra_botones">
        <button onClick={() => setModalVisible(true)}>
          <img src={iconoAddUser} alt="Añadir Usuario" id="img-btt-barra-opciones" />
        </button>
        <button onClick={() => console.log("Exportar Retiradas")} id="btt-pdf">
          <img src={iconoPDF} alt="PDF Retiradas" id="img-btt-barra-opciones" />
          <b><span>RETIRADAS</span></b>
        </button>
        <button onClick={() => console.log("Exportar Fichajes")} id="btt-pdf">
          <img src={iconoPDF} alt="PDF Fichajes" id="img-btt-barra-opciones" />
          <b><span>FICHAJES</span></b>
        </button>
        <button onClick={handleLogout}>
          <img src={iconoLogout} alt="Cerrar sesión" id="img-btt-barra-opciones" />
        </button>
      </div>

      {modalVisible && (
        <ModalAñadirUsuario
          onClose={() => setModalVisible(false)}
          onUsuarioCreado={() => {
            setModalVisible(false);
            // Aquí puedes refrescar la lista si lo necesitas
          }}
        />
      )}
    </div>
  );
}
