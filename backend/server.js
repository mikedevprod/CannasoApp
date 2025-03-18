import express from "express";
import {connectDB} from "./config/db.js";
import router from "./Router/Router.js";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true // Permitir cookies y credenciales
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(cookieParser())

// Conectar a MongoDB
const startServer = async () => {
  try {
    const uri = await connectDB();
    console.log(`Conectado a MongoDB: ${uri}`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Usar router
app.use('/api', router);

// Middleware para manejar errores
/*app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
