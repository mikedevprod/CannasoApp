import express from 'express';
import { registrarUsuario, autenticarUsuario, obtenerPerfil, logoutUsuario, verificarToken } from '../../controllers/authController.js';
import { proteger } from '../../middlewares/authMiddleware.js';

const authRoute = express.Router();

authRoute.post('/register', registrarUsuario);

authRoute.post('/login', autenticarUsuario);

authRoute.get('/perfil', proteger, obtenerPerfil);

authRoute.get('/verificar-token', proteger, verificarToken);

authRoute.post('/logout', logoutUsuario)

export default authRoute;
