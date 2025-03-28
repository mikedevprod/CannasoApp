import React, { useEffect, useState } from "react";

import "./styles/PanelPreviewer.css";

import PreviewPerfil from "../components/Previewer/PreviewPerfil.jsx";
import PanelDashboardColaborador from "../panels/PanelDashboardColaborador.jsx";

export default function PanelPreviewer({ perfilSeleccionado, setPerfiles}) {

  const condicionDashboard = !perfilSeleccionado || Object.keys(perfilSeleccionado).length === 0

  return (
    <div className="previewer">
  {  
    condicionDashboard? <PanelDashboardColaborador perfil={perfilSeleccionado} setPerfiles={setPerfiles}></PanelDashboardColaborador>
    : <PreviewPerfil perfil={perfilSeleccionado} setPerfiles={setPerfiles}/> 
  }
</div>

  );
}
