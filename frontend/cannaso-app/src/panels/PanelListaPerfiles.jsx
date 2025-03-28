import React, { useEffect, useState } from "react";
import BarraOpciones from "../components/PanelListaPerfiles/BarraOpciones.jsx";
import BuscadorPerfiles from "../components/PanelListaPerfiles/BuscadorPerfiles.jsx";
import ListaPerfiles from "../components/PanelListaPerfiles/ListaPerfiles.jsx";

import "./styles/PanelListaPerfiles.css";

export default function PanelListaPerfiles({ setPerfilSeleccionado, perfiles }) {
  const [valorBusqueda, setValorBusqueda] = useState("");

  return (
    <div id="panel_lista_perfiles">
      <BuscadorPerfiles setValorBusqueda={setValorBusqueda} />
      <ListaPerfiles
        valorBusqueda={valorBusqueda}
        setPerfilSeleccionado={setPerfilSeleccionado}
        perfiles={perfiles}
      />
      <BarraOpciones setDashboardSeleccionado={setPerfilSeleccionado}/>
    </div>
  );
}

