import { Schema, model } from "mongoose";

const retiradaSchema = new Schema(
  {
    idSocio: {
      type: String,
      required: true,
    },
    cantidad: {
      type: String,
      required: true,
    },
    fecha: {
      type: String,
      default: () => new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
    },
    firma: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Retirada", retiradaSchema);
