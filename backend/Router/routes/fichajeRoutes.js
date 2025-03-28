import express from 'express';
import {añadirFichaje, getFichajesBySocio} from '../../controllers/fichajeController.js'
import { proteger } from '../../middlewares/authMiddleware.js';

const fichajeRoute = express.Router();

fichajeRoute.post('/', proteger, añadirFichaje);
fichajeRoute.get('/:idSocio', proteger, getFichajesBySocio);

export default fichajeRoute;
