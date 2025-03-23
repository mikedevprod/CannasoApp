import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registrarUsuario = async (req, res) => {
  const { nombre, numeroSocio, password, rol } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({ numeroSocio });
    if (existeUsuario) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const usuario = await Usuario.create({
      nombre,
      numeroSocio,
      password,
      rol,
    });

    if (usuario) {
      const token = generarToken(usuario._id);

      // Guardar el token en una cookie HTTP Only
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
        sameSite: "strict", // Protege contra CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      });

      res.status(201).json({
        _id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
      });
    } else {
      res.status(400).json({ message: "Datos inválidos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const autenticarUsuario = async (req, res) => {
  const { numeroSocio, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ numeroSocio });
    const esUsuarioValido = usuario && usuario.rol !== 'comun' && (await usuario.matchPassword(password))

    if (esUsuarioValido) {
      const token = generarToken(usuario._id);

      // Guardar el token en una cookie HTTP Only
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const obtenerPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.user.id);

  if (usuario) {
    res.json({
      _id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    });
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
};
export const verificarToken = async (req, res) => {
  const usuario = await Usuario.findById(req.user.id);
  
  if (usuario) {
    res.json({
      message: "Token Verificado",
      nombre: usuario.nombre,
      rol: usuario.rol,
    });
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
};


export const logoutUsuario = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
    sameSite: "strict", // Protege contra CSRF
  });

  res.status(200).json({ message: "Sesión cerrada correctamente" });
};

