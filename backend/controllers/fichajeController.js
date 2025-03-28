import Fichaje from "../models/Fichaje.js";
import Usuario from "../models/Usuario.js";

export const añadirFichaje = async (req, res) => {
  const { idSocio } = req.body;

  try {
    const usuario = await Usuario.findById(idSocio);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const fichajeAbierto = await Fichaje.findOne({
      idSocio,
      fichajeCompletado: false,
    });

    if (fichajeAbierto) {
      // Fichaje de salida
      fichajeAbierto.salida = new Date().toLocaleTimeString();
      fichajeAbierto.fichajeCompletado = true;
      await fichajeAbierto.save();

      // Actualizar el estado del usuario a inactivo directamente en la base de datos
      await Usuario.findByIdAndUpdate(idSocio, { activo: false });

      return res
        .status(200)
        .json({ message: "Salida registrada", fichaje: fichajeAbierto });
    } else {
      // Fichaje de entrada con la hora actual
      const nuevoFichaje = new Fichaje({
        idSocio,
        entrada: new Date().toLocaleTimeString(),
        fecha: new Date().toISOString().split("T")[0],
      });
      await nuevoFichaje.save();

      // Actualizar el estado del usuario a activo directamente en la base de datos
      await Usuario.findByIdAndUpdate(idSocio, { activo: true });

      return res
        .status(201)
        .json({ message: "Entrada registrada", fichaje: nuevoFichaje });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al gestionar el fichaje" });
  }
};

export const getFichajesBySocio = async (req, res) => {
  const { idSocio } = req.params

  try {
    const fichajesCompletados = await Fichaje.find({
      idSocio,
      fichajeCompletado: true,
    }).select("-_id -__v -idSocio -fichajeCompletado");
  
    res.status(200).json(fichajesCompletados); // Retorna directamente el array de fichajes
  } catch (error) {
    res.status(500).send("ERROR FICHAJES - No se ha podido procesar la petición.");
  }
};
