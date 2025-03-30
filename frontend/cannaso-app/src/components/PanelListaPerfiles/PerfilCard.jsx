import React, { useEffect } from "react";
import "./styles/PerfilCard.css";

import avatarDefecto from "../../assets/avatars/man.png";

export default function PerfilCard({ perfil, setPerfilSeleccionado }) {
  const handleClickPerfil = () => {
    setPerfilSeleccionado(perfil);
  };

  useEffect(() => {}, []);

  // Determina si usar imagen subida o la por defecto
  const imagePath = perfil.foto?.startsWith("/assets/avatars/")
    ? perfil.foto
    : avatarDefecto;

  return (
    <div className="socio-card" onClick={handleClickPerfil}>
      <div className="container-avatar">
        <img className="socio-avatar" src={imagePath} alt="Avatar" />
        <div className="socio-id">{perfil.numeroSocio}</div>
      </div>
      <div className="container-name">
        <b>
          <p>{perfil.nombre}</p>
        </b>
      </div>
      <div className="container-led">
        <div
          className={`socio-led ${perfil.activo ? "socio-led-actived" : ""}`}
        ></div>
      </div>
    </div>
  );
}
