import express from 'express';

const checkDBRoute = express.Router();

checkDBRoute.get('/check-db', (req, res) => {
  res.status(200).json({ isPasswordSet: true }); // Respuesta dummy
});

export default checkDBRoute;
