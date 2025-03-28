import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import axios from "axios";
import { getDailyStayTime } from "../../services/estadisticas";

const generateRandomData = () => {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  return days.map((day) => ({
    day,
    value: Math.floor(Math.random() * 10), // Valores entre 0 y 10 horas
  }));
};

const getBarChartData = async (idSocio) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/fichaje/${idSocio}`, {
      withCredentials: true, // ✅ incluye la cookie con el JWT
    });

    return getDailyStayTime(response.data);
  } catch (error) {
    console.error("Error al obtener los datos:", error.response?.data || error.message);
    return [];
  }
};


const formatLabel = ({ value }) => {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return `${hours}h ${minutes}min`;
};

const BarChart = ({ idSocio }) => {
  const [randomData, setRandomData] = useState(generateRandomData());
  const [data, setData] = useState(generateRandomData());

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getBarChartData(idSocio);
      if (fetchedData.length > 0) {
        setData(fetchedData);
      }
    };

    fetchData();
  }, [idSocio]); // Se ejecuta cada vez que cambia idSocio

  return (
    <div style={{ height: 300 }}>
      <ResponsiveBar
        data={data} // Cambiado de randomData a data
        keys={["value"]}
        indexBy="day"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "set2" }}
        borderRadius={5}
        borderWidth={2}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Día",
          legendPosition: "middle",
          legendOffset: 32,
          format: (day) => {
            const dias = {
              Monday: "Lunes",
              Tuesday: "Martes",
              Wednesday: "Miércoles",
              Thursday: "Jueves",
              Friday: "Viernes",
              Saturday: "Sábado",
              Sunday: "Domingo",
            };
            return dias[day] || day;
          },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Horas",
          legendPosition: "middle",
          legendOffset: -40,
          tickValues: [0, 2, 4, 6, 8, 10], // Definir los valores del eje Y hasta 10
          format: (value) => `${value}h`, // Formato en horas
        }}
        minValue={0} // Mínimo en 0 horas
        maxValue={10} // Máximo en 10 horas
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        enableLabel={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        label={(bar) => formatLabel(bar)} // Formato de etiquetas en "XXh XXmin"
      />
    </div>
  );
};

export default BarChart;
