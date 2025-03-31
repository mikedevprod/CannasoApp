import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import "./styles/BarraOpciones.css";

import iconoAddUser from "../../assets/icons/agregar-usuario.png";
import iconoLogout from "../../assets/icons/cerrar-sesion.png";
import iconoPDF from "../../assets/icons/pdf.png";

import ModalAñadirUsuario from "./ModalAñadirUsuario.jsx";
import ModalSeleccionFechaRetiradas from "./ModalSeleccionFechaRetiradas.jsx";
import ModalSeleccionFechaFichajes from "./ModalSeleccionFechaFichajes.jsx";

export default function BarraOpciones({ setDashboardSeleccionado, perfilColaborador }) {
  const navigate = useNavigate();
  const limpiarUsuario = useAuthStore((state) => state.limpiarUsuario);

  const [modalAddUserVisible, setModalAddUserVisible] = useState(false);
  const [modalFechaRetiradasVisible, setModalFechaRetiradasVisible] = useState(false);
  const [modalFechaFichajesVisible, setModalFechaFichajesVisible] = useState(false);

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
        <button onClick={() => setModalAddUserVisible(true)}>
          <img src={iconoAddUser} alt="Añadir Usuario" id="img-btt-barra-opciones" />
        </button>

        {/* PDF Retiradas - Seleccionar Fecha */}
        <button onClick={() => setModalFechaRetiradasVisible(true)} id="btt-pdf">
          <img src={iconoPDF} alt="PDF Retiradas" id="img-btt-barra-opciones" />
          <b><span>RETIRADAS</span></b>
        </button>

        {/* PDF Fichajes - Seleccionar Fecha */}
        <button onClick={() => setModalFechaFichajesVisible(true)} id="btt-pdf">
          <img src={iconoPDF} alt="PDF Fichajes" id="img-btt-barra-opciones" />
          <b><span>FICHAJES</span></b>
        </button>

        <button onClick={handleLogout}>
          <img src={iconoLogout} alt="Cerrar sesión" id="img-btt-barra-opciones" />
        </button>
      </div>

      {modalAddUserVisible && (
        <ModalAñadirUsuario
          onClose={() => setModalAddUserVisible(false)}
          onUsuarioCreado={() => setModalAddUserVisible(false)}
        />
      )}

      {modalFechaRetiradasVisible && (
        <ModalSeleccionFechaRetiradas onClose={() => setModalFechaRetiradasVisible(false)} />
      )}

      {modalFechaFichajesVisible && (
        <ModalSeleccionFechaFichajes onClose={() => setModalFechaFichajesVisible(false)} />
      )}
    </div>
  );
}
