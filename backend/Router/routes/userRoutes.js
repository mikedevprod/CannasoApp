import express from 'express';
import { getSocios, actualizarUsuario } from '../../controllers/userController.js';
import uploadAvatar from '../../middlewares/uploadAvatar.js';

const sociosRoute = express.Router();

// Obtener todos los socios
sociosRoute.get("/socios", getSocios);

// Actualizar un socio (incluye imagen)
sociosRoute.put("/socios/:id", uploadAvatar.single("avatar"), actualizarUsuario);

export default sociosRoute;
