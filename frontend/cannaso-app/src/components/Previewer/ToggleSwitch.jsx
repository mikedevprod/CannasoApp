import React, { useState, useEffect, useRef } from "react";
import "./styles/ToggleSwitch.css";
import axios from "axios";

const FICHAJE_COOLDOWN = 900; // segundos → cambia aquí si quieres otro tiempo

const ToggleSwitch = ({ isActive, onToggle, perfil, perfilColaborador }) => {
  const [timers, setTimers] = useState(() => {
    const savedTimers = localStorage.getItem("timers");
    return savedTimers ? JSON.parse(savedTimers) : {};
  });
  const [vibrate, setVibrate] = useState(false);
  const intervalRefs = useRef({});

  const handleFichaje = async () => {
    const numeroSocio = perfil.numeroSocio;

    if (timers[numeroSocio]?.isDisabled) {
      setVibrate(true);
      setTimeout(() => setVibrate(false), 300);
      return;
    }

    try {
      const idSocio = perfil.id || perfil._id;
      if (!idSocio) return console.error("ID no válido");

      const response = await axios.post(
        "http://localhost:5000/api/fichaje",
        { idSocio, colaboradorAsociado: perfilColaborador },
        { withCredentials: true }
      );

      const fichaje = response.data.fichaje;
      const esEntrada = response.status === 201;
      const nuevoEstado = !fichaje.fichajeCompletado;

      perfil.active = nuevoEstado;
      onToggle();

      if (esEntrada) {
        const now = Date.now();
        const newTimers = {
          ...timers,
          [numeroSocio]: {
            isDisabled: true,
            countdown: FICHAJE_COOLDOWN,
            fichajeTimestamp: now,
          },
        };
        setTimers(newTimers);
        localStorage.setItem("timers", JSON.stringify(newTimers));
        startTimer(numeroSocio, now);
      } else {
        // Limpiar timer completamente al desfichar
        const updatedTimers = { ...timers };
        delete updatedTimers[numeroSocio];
        setTimers(updatedTimers);
        localStorage.setItem("timers", JSON.stringify(updatedTimers));
      }
    } catch (error) {
      console.error("❌ Error fichaje:", error.response?.data || error.message);
    }
  };

  const startTimer = (numeroSocio, timestamp) => {
    clearInterval(intervalRefs.current[numeroSocio]);

    intervalRefs.current[numeroSocio] = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timestamp) / 1000);
      const remaining = FICHAJE_COOLDOWN - elapsed;

      setTimers((prev) => {
        const updated = {
          ...prev,
          [numeroSocio]: {
            ...prev[numeroSocio],
            countdown: remaining > 0 ? remaining : 0,
            isDisabled: remaining > 0,
          },
        };

        localStorage.setItem("timers", JSON.stringify(updated));

        if (remaining <= 0) {
          clearInterval(intervalRefs.current[numeroSocio]);
          delete intervalRefs.current[numeroSocio];
        }

        return updated;
      });
    }, 1000);
  };

  useEffect(() => {
    const savedTimers = localStorage.getItem("timers");
    const parsedTimers = savedTimers ? JSON.parse(savedTimers) : {};

    const timer = parsedTimers[perfil.numeroSocio];
    if (timer) {
      const elapsedSeconds = Math.floor((Date.now() - timer.fichajeTimestamp) / 1000);
      const remaining = FICHAJE_COOLDOWN - elapsedSeconds;

      if (remaining > 0) {
        const updatedTimers = {
          [perfil.numeroSocio]: {
            ...timer,
            countdown: remaining,
            isDisabled: true,
          },
        };
        setTimers(updatedTimers);
        localStorage.setItem("timers", JSON.stringify(updatedTimers));
        startTimer(perfil.numeroSocio, timer.fichajeTimestamp);
      } else {
        localStorage.removeItem("timers");
        setTimers({});
      }
    } else {
      setTimers({});
    }

    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, [perfil.numeroSocio]);

  const timerData = timers[perfil.numeroSocio] || { isDisabled: false, countdown: 0 };

  return (
    <div className={`toggle-container ${isActive ? "active" : ""}`}> 
      <div 
        className={`toggle-switch ${isActive ? "active" : ""} ${timerData.isDisabled ? "disabled" : ""} ${vibrate ? "vibrate" : ""}`} 
        style={{
          backgroundColor: timerData.isDisabled ? "gray" : isActive ? "#378b41" : "#c2270f",
          cursor: timerData.isDisabled ? "default" : "pointer",
        }}
      >
        <span className="toggle-label">{isActive ? "Activo" : "Inactivo"}</span>
        <div className="switch-circle" onClick={handleFichaje}>
          {isActive ? <span className="check">✔</span> : <span className="cross">✖</span>}
        </div>
      </div>
      {timerData.isDisabled && (
        <div className={`countdown-toggle visible`}>
          {`${Math.floor(timerData.countdown / 60)}:${(timerData.countdown % 60).toString().padStart(2, "0")}`}
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;
