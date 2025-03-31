import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

// Utilidad para convertir firma base64 a imagen
function dataURLToImage(dataURL, callback) {
  const img = new Image();
  img.onload = function () {
    const maxWidth = 100;
    const maxHeight = 100;
    let width = img.width;
    let height = img.height;

    const aspectRatio = width / height;
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    callback(img, width, height);
  };
  img.src = dataURL;
}

// Exportar fichajes (por fecha)
export async function handleGenerarPDFichajes(fecha) {
  const res = await axios.get(`/api/fichaje/fichajes/${fecha}`);
  const fichajes = res.data;

  console.log(fichajes);

  const arrayFichajes = fichajes.map(f => [
    f.entrada,
    f.salida,
    f.fecha,
    f.numeroSocio
  ]);

  const doc = new jsPDF();
  autoTable(doc, {
    head: [['ENTRADA', 'SALIDA', 'FECHA', 'SOCIO']],
    body: arrayFichajes,
    styles: {
      valign: 'middle',
      halign: 'center',
      lineWidth: 0.1,
      lineColor: "black"
    },
    showHead: "everyPage",
  });

  doc.save(`Fichajes_${fecha}.pdf`);
}

// Exportar retiradas (por fecha)
export async function handleGenerarPDFRetiradas(fecha) {
  const res = await axios.get(`/api/retiradas/${fecha}`);
  const retiradas = res.data;

  const arrayRetiradas = [];
  const firmasImagenes = [];

  let cargadas = 0;

  retiradas.forEach((retirada, index) => {
    dataURLToImage(retirada.firma, (img, width, height) => {
      arrayRetiradas.push([
        retirada.cantidad,
        retirada.fecha,
        retirada.idSocio,
        "", // evitamos texto basura, la firma va como imagen
      ]);
      firmasImagenes[index] = img;
      cargadas++;

      if (cargadas === retiradas.length) {
        generarPDF();
      }
    });
  });

  function generarPDF() {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["CANTIDAD", "FECHA", "SOCIO", "FIRMA"]],
      body: arrayRetiradas,
      styles: {
        cellPadding: { top: 4.5, bottom: 4.5 },
        valign: "middle",
        halign: "center",
        lineWidth: 0.1,
        lineColor: "black",
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 50 },
      },
      didDrawCell: (data) => {
        const isFirmaCol = data.section === "body" && data.column.index === 3;
        const rowIndex = data.row.index;

        if (isFirmaCol && firmasImagenes[rowIndex] instanceof HTMLImageElement) {
          const img = firmasImagenes[rowIndex];
          const imageWidth = data.cell.width - 4;
          const imageHeight = data.cell.height - 4;
          const centerX = data.cell.x + (data.cell.width - imageWidth) / 2;
          const centerY = data.cell.y + (data.cell.height - imageHeight) / 2;

          data.doc.addImage(img, centerX, centerY, imageWidth, imageHeight);
        }
      },
    });

    doc.save(`Retiradas_${fecha}.pdf`);
  }
}
