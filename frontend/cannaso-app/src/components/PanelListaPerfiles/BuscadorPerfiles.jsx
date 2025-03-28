import React from "react";

import "./styles/BuscadorPerfiles.css";

export default function BuscadorPerfiles({ setValorBusqueda }) {
  const handleOnChangeBuscador = (eventBuscador) => {
    const valorBuscador = eventBuscador.target.value;

    setValorBusqueda(valorBuscador);
  };

  return (
    <div id="buscador_perfiles">
      <input
        type="search"
        name="search_perfil"
        id="search_perfil"
        onChange={handleOnChangeBuscador}
      />
    </div>
  );
}
