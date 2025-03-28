import Usuario from "../models/Usuario.js";

export const getSocios = async (req, res) => {
  try {
    const socios = await Usuario.find().select("nombre numeroSocio foto rol activo");

    if (socios) {
      res.send(socios);
    }
  } catch (error) {
    res.status(500).send({ message: "Problema al buscar Socios.", error });
  }
};
