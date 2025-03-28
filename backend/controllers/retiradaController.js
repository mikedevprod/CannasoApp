import Retirada from "../models/Retirada.js"

export const añadirRetirada = async (req, res)=>{

    const {idSocio, cantidad, firma} = req.body

    const nuevaRetirada = new Retirada({
        idSocio,
        cantidad,
        firma
    })

    console.log(nuevaRetirada);

    res.send("Ruta Retirada")
}