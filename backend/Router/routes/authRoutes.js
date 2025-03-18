import express from 'express';
import { registrarUsuario, autenticarUsuario, obtenerPerfil, logoutUsuario } from '../../controllers/authController.js';
import { proteger } from '../../middlewares/authMiddleware.js';

const authRoute = express.Router();

// Ruta para registrar un nuevo usuario
authRoute.post('/register', registrarUsuario);

// Ruta para autenticar usuario (login)
authRoute.post('/login', autenticarUsuario);

// Ruta para obtener el perfil del usuario (protegida)
authRoute.get('/perfil', proteger, obtenerPerfil);

authRoute.post('/logout', logoutUsuario)

export default authRoute;
