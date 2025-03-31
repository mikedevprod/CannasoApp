import React from "react";
import ModalSeleccionFecha from "./ModalSeleccionFecha";
import { handleGenerarPDFRetiradas } from "../../services/pdfServices";

export default function ModalSeleccionFechaRetiradas({ onClose }) {
  const handleGenerar = async (fecha) => {
    try {
      await handleGenerarPDFRetiradas(fecha); // ✅ usa la fecha seleccionada
      onClose();
    } catch (error) {
      console.error("Error al generar PDF de retiradas:", error);
    }
  };

  return (
    <ModalSeleccionFecha
      tipo="retiradas"
      onClose={onClose}
      onConfirm={handleGenerar} // ✅ no se ejecuta hasta confirmar
    />
  );
}
