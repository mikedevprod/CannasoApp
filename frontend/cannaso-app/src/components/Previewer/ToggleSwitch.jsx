import React, { useState, useEffect, useRef } from "react";
import "./styles/ToggleSwitch.css";
import axios from "axios";

const ToggleSwitch = ({ isActive, onToggle, perfil }) => {
  const [timers, setTimers] = useState(() => {
    const savedTimers = localStorage.getItem("timers");
    return savedTimers ? JSON.parse(savedTimers) : {};
  });
  const [vibrate, setVibrate] = useState(false);
  const intervalRefs = useRef({});

  const handleFichaje = async () => {
    if (timers[perfil.numeroSocio]?.isDisabled) {
      setVibrate(true);
      setTimeout(() => setVibrate(false), 300);
      return;
    }
  
    try {
      if (!perfil || !(perfil.id || perfil._id)) {
        console.error("Perfil no válido o ID no definido");
        return;
      }
  
      const idSocio = perfil.id || perfil._id;
  
      const response = await axios.post(
        "http://localhost:5000/api/fichaje",
        { idSocio },
        {
          withCredentials: true, // ✅ envía la cookie con el JWT
        }
      );
  
      const nuevoEstado = response.data.fichaje.fichajeCompletado ? false : true;
      onToggle();
      perfil.active = nuevoEstado;
  
      if (nuevoEstado) {
        const now = new Date().getTime();
        const newTimers = {
          ...timers,
          [perfil.numeroSocio]: {
            isDisabled: true,
            countdown: 900,
            fichajeTimestamp: now,
          },
        };
        setTimers(newTimers);
        localStorage.setItem("timers", JSON.stringify(newTimers));
  
        startTimer(perfil.numeroSocio, now);
      }
    } catch (error) {
      console.error("Error al gestionar el fichaje:", error.response?.data || error.message);
    }
  };
  

  const startTimer = (numeroSocio, timestamp) => {
    clearInterval(intervalRefs.current[numeroSocio]); // Limpiar cualquier intervalo previo

    intervalRefs.current[numeroSocio] = setInterval(() => {
      const elapsedSeconds = Math.floor((new Date().getTime() - timestamp) / 1000);
      const remaining = 900 - elapsedSeconds;

      setTimers((prevTimers) => {
        const updatedTimers = {
          ...prevTimers,
          [numeroSocio]: {
            ...prevTimers[numeroSocio],
            countdown: remaining > 0 ? remaining : 0,
            isDisabled: remaining > 0,
          },
        };
        localStorage.setItem("timers", JSON.stringify(updatedTimers));

        if (remaining <= 0) {
          clearInterval(intervalRefs.current[numeroSocio]);
          delete intervalRefs.current[numeroSocio];
        }

        return updatedTimers;
      });
    }, 1000);
  };

  useEffect(() => {
    const savedTimers = localStorage.getItem("timers");
    const parsedTimers = savedTimers ? JSON.parse(savedTimers) : {};

    Object.keys(parsedTimers).forEach((numeroSocio) => {
      const elapsedSeconds = Math.floor((new Date().getTime() - parsedTimers[numeroSocio].fichajeTimestamp) / 1000);
      const remaining = 900 - elapsedSeconds;

      if (remaining > 0) {
        setTimers((prevTimers) => ({
          ...prevTimers,
          [numeroSocio]: {
            ...parsedTimers[numeroSocio],
            countdown: remaining,
            isDisabled: true,
          },
        }));
        startTimer(numeroSocio, parsedTimers[numeroSocio].fichajeTimestamp);
      } else {
        localStorage.removeItem("timers");
      }
    });

    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, [perfil.numeroSocio]);

  const timerData = timers[perfil.numeroSocio] || { isDisabled: false, countdown: 0 };

  return (
    <div className={`toggle-container ${isActive ? "active" : ""}`}> 
      <div 
        className={`toggle-switch ${isActive ? "active" : ""} ${timerData.isDisabled ? "disabled" : ""} ${vibrate ? "vibrate" : ""}`} 
        style={{ backgroundColor: timerData.isDisabled ? "gray" : isActive ? "#378b41" : "#c2270f", cursor: timerData.isDisabled ? "default" : "pointer" }}
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
