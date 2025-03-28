import React, { useEffect, useState } from "react";
import './styles/DonutChart.css';

const DonutChart = ({ percentage }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0); // Estado animado

  useEffect(() => {
    // Anima el porcentaje suavemente
    const timeout = setTimeout(() => setAnimatedPercentage(percentage), 100);
    return () => clearTimeout(timeout);
  }, [percentage]);

  const radius = 50; // Radio del círculo
  const strokeWidth = 10; // Ancho del borde
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="donut-container">
      
      <div className="donut-wrapper">
        <svg
          viewBox="0 0 120 120"
          className="donut-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Círculo de fondo */}
          <circle
            cx="60"
            cy="60"
            r={normalizedRadius}
            fill="transparent"
            stroke="#ccc"
            strokeWidth={strokeWidth}
          />

          {/* Círculo de progreso con animación */}
          <circle
            cx="60"
            cy="60"
            r={normalizedRadius}
            fill="transparent"
            stroke="green"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            className="donut-progress"
          />

          {/* Texto en el centro */}
          <text
            x="60"
            y="65"
            textAnchor="middle"
            fontSize="20"
            fill="black"
            fontWeight="bold"
          >
            {animatedPercentage}%
          </text>
        </svg>
      </div>
    </div>
  );
};

export default DonutChart;
