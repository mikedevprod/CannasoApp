import React from "react";
import ModalSeleccionFecha from "./ModalSeleccionFecha";
import { handleGenerarPDFichajes } from "../../services/pdfServices";

export default function ModalSeleccionFechaFichajes({ onClose }) {
  const handleGenerar = async (fecha) => {
    try {
      await handleGenerarPDFichajes(fecha);
      onClose();
    } catch (error) {}
  };

  return (
    <ModalSeleccionFecha
      tipo="fichajes"
      onClose={onClose}
      onConfirm={handleGenerar}
    />
  );
}
