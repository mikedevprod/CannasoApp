import express from 'express';
import authRoute from './routes/authRoutes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoute);

export default router;
