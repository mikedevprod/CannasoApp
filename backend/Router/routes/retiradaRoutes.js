import express from 'express';
import { verificarRol, proteger } from '../../middleware/authMiddleware.js';
import { añadirRetirada } from '../../controllers/retiradaController.js';

const retiradaRouter = express.Router();

// Solo colaboradores o admins pueden registrar retiradas
retiradaRouter.post('/', proteger, verificarRol("colaborador", "admin"), añadirRetirada);

export default retiradaRouter;