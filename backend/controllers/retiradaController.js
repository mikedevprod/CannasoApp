import Retirada from "../models/Retirada.js";
import Usuario from "../models/Usuario.js";

export const añadirRetirada = async (req, res) => {
  try {
    const { idSocio, cantidad, firma } = req.body;

    if (!idSocio || !cantidad || !firma) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // 1. Buscar usuario
    const socio = await Usuario.findOne({ numeroSocio: String(idSocio) });

    if (!socio) {
      return res.status(404).json({ message: "Socio no encontrado." });
    }

    // 2. Validar si el socio está activo
    if (!socio.activo) {
      return res
        .status(403)
        .json({ message: "El socio no está actualmente en la asociación." });
    }

    // 3. Validar cantidad
    const cantidadNumerica = parseFloat(cantidad);
    if (isNaN(cantidadNumerica)) {
      return res.status(400).json({ message: "Cantidad inválida." });
    }
    const cantidadValida = socio.cantidadTotalRetirada + cantidadNumerica <= 60;
    if (cantidadValida) {
      // 4. Crear la retirada
      const nuevaRetirada = new Retirada({
        idSocio: String(idSocio),
        cantidad: String(cantidad),
        firma: String(firma),
        fecha: new Date().toISOString().split("T")[0],
      });

      await nuevaRetirada.save();

      // 5. Actualizar cantidad total retirada
      socio.cantidadTotalRetirada += cantidadNumerica;
      await socio.save();

      console.log("✅ Retirada registrada y cantidad actualizada.");
      res
        .status(201)
        .json({ message: "Retirada y actualización completadas." });
    } else {
      res.status(500).json({ message: "Error al registrar retirada.", error });
    }
  } catch (error) {
    console.error("❌ Error en añadirRetirada:", error);
    res.status(500).json({ message: "Error al registrar retirada.", error });
  }
};

export const getRetiradas = async (req, res) => {
  const {fecha} = req.params

  try {
    const retiradas = await Retirada.find({fecha: fecha});
    res.status(200).send(retiradas);
  } catch (error) {
    res.status(500).send("No se han conseguido las retiradas.");
  }
};
