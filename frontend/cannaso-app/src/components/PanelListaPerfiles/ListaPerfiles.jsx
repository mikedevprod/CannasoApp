import { React, useEffect } from "react";

import "./styles/ListaPerfiles.css";

import PerfilCard from "./PerfilCard.jsx";

export default function ListaPerfiles({
  valorBusqueda,
  setPerfilSeleccionado,
  perfiles,
}) {
  const mostrarListaSociosActivos = () => {
    if (!perfiles || !Array.isArray(perfiles)) return [];

    return perfiles
      .filter((perfil) => perfil.activo)
      .map((perfil) => (
        <PerfilCard
          key={perfil.numeroSocio}
          perfil={perfil}
          setPerfilSeleccionado={setPerfilSeleccionado}
        />
      ));
  };

  const filtrarSociosPorBusqueda = () => {
    if (!perfiles || !Array.isArray(perfiles)) return [];

    const valorBusquedaFormateado = valorBusqueda.toLowerCase();
    return perfiles
      .filter(
        (perfil) =>
          perfil.nombre?.toLowerCase().startsWith(valorBusquedaFormateado) ||
          perfil.numeroSocio?.toString().startsWith(valorBusquedaFormateado)
      )
      .map((perfil) => (
        <PerfilCard
          key={perfil.numeroSocio}
          perfil={perfil}
          setPerfilSeleccionado={setPerfilSeleccionado}
        />
      ));
  };

  return (
    <div id="lista_perfiles">
      {valorBusqueda ? filtrarSociosPorBusqueda() : mostrarListaSociosActivos()}
    </div>
  );
}
