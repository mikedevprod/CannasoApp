import express from 'express';
import { establecerContraseñaDB } from '../../config/setDBPassword.js';

const setupDBRoute = express.Router();

setupDBRoute.post('/setup-db', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'La contraseña es obligatoria' });
  }

  try {
    await establecerContraseñaDB(password);
    res.status(200).json({ message: 'Contraseña establecida correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default setupDBRoute;