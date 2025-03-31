import Usuario from "../models/Usuario.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Ruta absoluta a la carpeta de avatares
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATAR_DIR = path.resolve(__dirname, "../../frontend/cannaso-app/public/assets/avatars");

// Obtener todos los socios
export const getSocios = async (req, res) => {
  try {
    const socios = await Usuario.find().select("nombre numeroSocio foto cantidadTotalRetirada rol activo");

    if (socios) {
      res.send(socios);
    }
  } catch (error) {
    res.status(500).send({ message: "Problema al buscar Socios.", error });
  }
};

// Actualizar usuario (incluye reemplazo de imagen si se edita)
export const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza campos si llegan en req.body
    if (req.body.nombre) usuario.nombre = req.body.nombre;
    if (req.body.numeroSocio) usuario.numeroSocio = req.body.numeroSocio;
    if (req.body.rol) usuario.rol = req.body.rol;

    // Procesar nuevo avatar si se ha subido
    if (req.file) {
      // Eliminar el avatar anterior si no es el predeterminado
      if (usuario.foto && !usuario.foto.endsWith("man.png")) {
        const archivoAnterior = path.basename(usuario.foto); // más robusto que split
        const rutaCompleta = path.join(AVATAR_DIR, archivoAnterior);

        try {
          if (fs.existsSync(rutaCompleta)) {
            fs.unlinkSync(rutaCompleta);
            console.log(`🗑️ Avatar anterior eliminado: ${archivoAnterior}`);
          }
        } catch (err) {
          console.warn(`⚠️ No se pudo eliminar el avatar anterior: ${err.message}`);
        }
      }

      // Asignar nuevo avatar (ruta relativa desde /public)
      usuario.foto = `/assets/avatars/${req.file.filename}`;
    }

    const actualizado = await usuario.save();
    res.status(200).json(actualizado);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};
