import React, { useRef, useState, useEffect } from "react";
import "./styles/ModalRetirarSocio.css";
import axios from "axios";

export default function ModalRetirarSocio({ perfil, onClose }) {
  const [cantidad, setCantidad] = useState("");
  const [firma, setFirma] = useState(""); // Estado para guardar la imagen en string
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    const startDrawing = (event) => {
      isDrawing.current = true;
      ctx.beginPath();
      const { offsetX, offsetY } = getEventCoords(event);
      ctx.moveTo(offsetX, offsetY);
    };

    const draw = (event) => {
      if (!isDrawing.current) return;
      const { offsetX, offsetY } = getEventCoords(event);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing.current = false;
      ctx.beginPath();
      saveSignature(); // Guardar firma cuando se deja de dibujar
    };

    const getEventCoords = (event) => {
      if (event.touches) {
        const rect = canvas.getBoundingClientRect();
        return {
          offsetX: event.touches[0].clientX - rect.left,
          offsetY: event.touches[0].clientY - rect.top,
        };
      }
      return { offsetX: event.offsetX, offsetY: event.offsetY };
    };

    const saveSignature = () => {
      const signatureData = canvas.toDataURL(); // Guardar la imagen como string Base64
      setFirma(signatureData);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);

      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(firma);
    /*try {
      await axios.post("http://localhost:5000/api/retiradas", {
        idSocio: perfil.id,
        cantidad,
        firma, // Enviar la imagen almacenada en el estado
      });
      onClose();
    } catch (error) {
      console.error("Error al registrar la retirada:", error);
    }*/
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFirma(""); // Limpiar la variable de la firma
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          Retirar Cantidad -{" "}
          <span style={{ color: "orange" }}>
            <i>Socio Nº {perfil.numeroSocio}</i>
          </span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="containerCantidadRetirada">
            <label>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </div>

          <div className="containerFirmaRetirada">
            <label>Firma:</label>
            <canvas
              ref={canvasRef}
              width={300}
              height={100}
              style={{ border: "1px solid black", touchAction: "none" }}
            ></canvas>
            <button type="button" onClick={clearCanvas}>
              Borrar Firma
            </button>
          </div>

          {/* Mostrar la firma en Base64 */}
          {/**firma && (
            <div>
              <p>Firma Base64:</p>
              <textarea readOnly value={firma} rows="4" style={{ width: "100%" }} />
            </div>
          ) */}

          <div className="modal-actions">
            <button type="submit">Confirmar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
