import express from 'express';
import {añadirFichaje, getFichajesBySocio, getFichajesFecha} from '../../controllers/fichajeController.js'
import { proteger } from '../../middlewares/authMiddleware.js';

const fichajeRoute = express.Router();

fichajeRoute.post('/', proteger, añadirFichaje);
fichajeRoute.get('/:idSocio', proteger, getFichajesBySocio);
fichajeRoute.get('/fichajes/:fecha', proteger, getFichajesFecha);

export default fichajeRoute;
