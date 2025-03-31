import express from 'express';
import { proteger } from '../../middlewares/authMiddleware.js';
import { añadirRetirada, getRetiradas } from '../../controllers/retiradaController.js';

const retiradaRouter = express.Router();

// Solo colaboradores o admins pueden registrar retiradas
retiradaRouter.post('/', proteger, añadirRetirada);
retiradaRouter.get('/:fecha', proteger, getRetiradas);

export default retiradaRouter;