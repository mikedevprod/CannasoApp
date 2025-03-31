import React, { useState } from "react";
import "./styles/ModalSeleccionFecha.css";

export default function ModalSeleccionFecha({ onClose, onConfirm, tipo }) {
  const [fecha, setFecha] = useState("");

  const handleConfirmar = () => {
    if (fecha) {
      onConfirm(fecha); // ✅ Solo llama cuando hay fecha
    }
  };

  return (
    <div className="modal-fecha-overlay">
      <div className="modal-fecha-contenido">
        <h3>Selecciona una fecha para exportar {tipo}</h3>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <div className="modal-fecha-botones">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleConfirmar}>Generar PDF</button>
        </div>
      </div>
    </div>
  );
}
