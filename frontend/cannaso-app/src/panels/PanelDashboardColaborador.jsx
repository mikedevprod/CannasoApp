import React, { useRef, useState } from "react";
import "./styles/PanelDashboardColaborador.css";
import iconAvatarTest from "../assets/avatars/man.png";
// import ModalAñadirSocio from "../components/PreviewerColaborador/ModalAñadirSocio.jsx";

export default function PanelDashboardColaborador({ perfil, setPerfiles }) {
  const previewRef = useRef(null);
  const container = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (!perfil) return null; // Previene renderizado si el perfil es null

  return (
    <div id="preview_perfil_admin" ref={previewRef}>
      <div className="preview_perfil_admin_header">
        <div className="container-avatar-admin">
          <img className="socio-avatar-admin" src={iconAvatarTest} alt="Avatar" />
          <div className="socio-id-admin">{perfil?.numeroSocio ?? "Sin número"}</div>
        </div>
        <div className="preview_perfil_admin_header_info">
          <h1>{perfil?.name ?? "Sin nombre"}</h1>
        </div>
        <div className="preview_perfil_admin_header_actions">
          <button className="admin_action" onClick={() => setModalOpen(true)}>Añadir Socio</button>
          <button className="admin_action">Eliminar Socio</button>
          <button className="admin_action">Retiradas</button>
          <button className="admin_action">Fichajes</button>
        </div>
      </div>

      <div ref={container} className="swapy-admin-container">
        <div data-swapy-slot="1">
          <div data-swapy-item="1" className="swapy-admin-item" id="chartA"></div>
        </div>
        <div data-swapy-slot="2">
          <div data-swapy-item="2" className="swapy-admin-item" id="chartB"></div>
        </div>
        <div data-swapy-slot="3">
          <div data-swapy-item="3" className="swapy-admin-item" id="chartC"></div>
        </div>
        <div data-swapy-slot="4">
          <div data-swapy-item="4" className="swapy-admin-item" id="chartD"></div>
        </div>
      </div>

      {/* {isModalOpen && <ModalAñadirSocio setPerfiles={setPerfiles} onClose={() => setModalOpen(false)} />} */}
    </div>
  );
}
