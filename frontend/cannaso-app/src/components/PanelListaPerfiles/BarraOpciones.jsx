import React from "react";

import "./styles/BarraOpciones.css";

export default function BarraOpciones({setDashboardSeleccionado}) {

  const handleSeleccionarDashboard = ()=>{
    setDashboardSeleccionado(dashSeleccionado => !dashSeleccionado)
  }

  return <div id="barra_opciones">
    <h2>Colaborador: {setDashboardSeleccionado.nombre}</h2>
    <button onClick={handleSeleccionarDashboard}>Dashboard</button>
  </div>;
}
