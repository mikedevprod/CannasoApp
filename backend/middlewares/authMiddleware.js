import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const proteger = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Usuario.findById(decoded.id).select('-password');

      if (!token) {
        console.log("No hay token. Cerrando sesión...");
        return res.status(401).json({ message: "No autorizado, no hay token" });
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autorizado' });
      }

      // Solo permitir acceso si el rol es colaborador o admin
      if (req.user.rol !== 'admin' && req.user.rol !== 'colaborador') {
        return res.status(403).json({ message: 'Acceso denegado' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  } else {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};