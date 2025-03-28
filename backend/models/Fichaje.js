import { Schema, model } from "mongoose";

const fichajeSchema = new Schema({
  idSocio: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]  // Fecha actual en formato YYYY-MM-DD
  },
  entrada: {
    type: String,
    default: () => new Date().toLocaleTimeString()         // Hora exacta de entrada
  },
  salida: {
    type: String,
    default: "Sin Hora de Salida."
  },
  fichajeCompletado: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false
});

export default model("Fichaje", fichajeSchema);
