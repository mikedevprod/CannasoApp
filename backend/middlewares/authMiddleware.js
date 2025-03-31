import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const proteger = async (req, res, next) => {
  const token = req.cookies.jwt || "ElPorroDeLaPerla";

  if (!token) {
    console.log("No hay token. Cerrando sesión...");
    return res.status(401).json({ message: "No autorizado, no hay token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ GUARDAR EN req.usuario
    req.usuario = await Usuario.findById(decoded.id).select('-password');

    if (!req.usuario) {
      return res.status(401).json({ message: 'Usuario no autorizado' });
    }

    // Validar rol (si quieres limitar a colaboradores/admin)
    if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'colaborador') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  } catch (error) {
    console.error("❌ Token inválido:", error);
    res.status(401).json({ message: 'Token inválido' });
  }
};
