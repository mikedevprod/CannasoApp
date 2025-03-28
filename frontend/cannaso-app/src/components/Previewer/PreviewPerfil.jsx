import React, { useEffect, useRef, useState } from "react";
import "./styles/PreviewPerfil.css";
import ToggleSwitch from "./ToggleSwitch.jsx";
import ModalEditarSocio from "./ModalEditarSocio.jsx";
import ModalRetirarSocio from "./ModalRetirarSocio.jsx";
import DonutChart from "./DonutChart.jsx";
import BarChart from "./BarChart.jsx";
import { createSwapy } from "swapy";

import avatarDefecto from "../../assets/avatars/man.png";

export default function PreviewPerfil({ perfil, setPerfiles }) {
  const previewRef = useRef(null);
  const containerRef = useRef(null);
  const swapyRef = useRef(null);
  const [isActive, setIsActive] = useState(perfil.active);
  const [isHidden, setIsHidden] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRetirarModalOpen, setRetirarModalOpen] = useState(false);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = 0;
    }
    setIsActive(perfil.activo);

    setIsHidden(true);
    const timer = setTimeout(() => {
      setIsHidden(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [perfil]);

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        manualSwap: false, // Permite la actualización automática de los elementos
      });
    }
    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  const toggleActive = () => {
    const nuevoEstado = !isActive;
    setIsActive(nuevoEstado);
    setPerfiles((prevPerfiles) =>
      prevPerfiles.map((p) =>
        p.numeroSocio === perfil.numeroSocio ? { ...p, active: nuevoEstado } : p
      )
    );
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleRetirarClick = () => {
    setRetirarModalOpen(true);
  };

  const imagePath = perfil.foto ? perfil.foto : avatarDefecto;

  return (
    <div id="preview_perfil" ref={previewRef} className={isHidden ? "hidden" : ""}>
      <div className="preview_perfil_header">
        <div className="container-avatar-perfil">
          <img className="socio-avatar-perfil" src={imagePath} alt="Avatar" />
          <div className="socio-id-perfil">{perfil.numeroSocio}</div>
        </div>
        <div className="preview_perfil_header_info">
          <h1>{perfil.nombre}</h1>
          <div className="containerIconoOnline">
            <ToggleSwitch isActive={isActive} onToggle={toggleActive} perfil={perfil} />
          </div>
        </div>
        <div className="preview_perfil_header_actions">
          <button className="action" onClick={handleEditClick}>Editar</button>
          <button className="action" onClick={handleRetirarClick}>Retirar</button>
          <button className="action">Retiradas</button>
          <button className="action">Fichajes</button>
        </div>
      </div>
      {isEditModalOpen && (
        <ModalEditarSocio perfil={perfil} setPerfiles={setPerfiles} onClose={() => setEditModalOpen(false)} />
      )}
      {isRetirarModalOpen && (
        <ModalRetirarSocio perfil={perfil} onClose={() => setRetirarModalOpen(false)} />
      )}

      <div ref={containerRef} className="swapy-container">
        <div data-swapy-slot="1">
          <div data-swapy-item="1" className="swapy-item" id="chartA"></div>
        </div>
        <div data-swapy-slot="2">
          <div data-swapy-item="2" className="swapy-item" id="chartB"></div>
        </div>
        <div data-swapy-slot="3">
          <div data-swapy-item="3" className="swapy-item" id="chartC">
            <h2 className="donut-title">Estancia Semanal</h2>
            <BarChart idSocio={perfil.id} />
          </div>
        </div>
        <div data-swapy-slot="4">
          <div data-swapy-item="4" className="swapy-item" id="chartD">
            <h2 className="donut-title">Cantidad Retirada</h2>
            <DonutChart percentage={perfil.numeroSocio} />
          </div>
        </div>
      </div>
    </div>
  );
}
