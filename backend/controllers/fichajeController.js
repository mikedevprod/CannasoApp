import Fichaje from "../models/Fichaje.js";
import Usuario from "../models/Usuario.js";

export const añadirFichaje = async (req, res) => {
  const { idSocio } = req.body;
  const socioColaborador = req.usuario;

  try {
    const usuario = await Usuario.findById(idSocio);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const fichajeAbierto = await Fichaje.findOne({
      numeroSocio: usuario.numeroSocio,
      fichajeCompletado: false,
    });

    if (fichajeAbierto) {
      fichajeAbierto.salida = new Date().toLocaleTimeString();
      fichajeAbierto.fichajeCompletado = true;
      await fichajeAbierto.save();

      await Usuario.findByIdAndUpdate(idSocio, { activo: false });

      return res.status(200).json({ message: "Salida registrada", fichaje: fichajeAbierto });
    } else {
      const nuevoFichaje = new Fichaje({
        numeroSocio: usuario.numeroSocio,
        entrada: new Date().toLocaleTimeString(),
        fecha: new Date().toISOString().split("T")[0],
        colaboradorAsociado: socioColaborador,
      });

      await nuevoFichaje.save();
      await Usuario.findByIdAndUpdate(idSocio, { activo: true });

      return res.status(201).json({ message: "Entrada registrada", fichaje: nuevoFichaje });
    }
  } catch (error) {
    console.error("❌ Error en crear fichaje:", error);
    return res.status(500).json({ message: "Error al gestionar el fichaje", error: error.message });
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

export const getFichajesFecha = async (req, res) =>{
  const {fecha} = req.params

  try {
    const fichajes = await Fichaje.find({fecha})
    res.status(200).send(fichajes)
  } catch (error) {
    res.status(500).send("No se han conseguido los fichajes")
  }
}