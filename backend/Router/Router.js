import express from 'express';
import authRoute from './routes/authRoutes.js';
import setupDBRoute from './routes/setupDBRoutes.js';
import checkDBRoute from './routes/checkDbRoute.js';
import sociosRoute from './routes/userRoutes.js';
import fichajeRoute from './routes/fichajeRoutes.js';
import retiradaRouter from './routes/retiradaRoutes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoute);

router.use('/setup', setupDBRoute);

router.use('/check', checkDBRoute);

router.use('/socio', sociosRoute)

router.use('/fichaje', fichajeRoute)

router.use('/retiradas', retiradaRouter)

export default router;
