import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    numeroSocio: { type: String, unique: true, required: true },
    rol: {
      type: String,
      enum: ["comun", "colaborador", "admin"],
      required: true,
    },
    cantidadTotalRetirada: {type: Number, default: 0},
    foto: { type: String },
    activo: { type: Boolean, default: false },
    password: { type: String },
  },
  { timestamps: true }
);

// Encriptar contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar contraseña
usuarioSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
