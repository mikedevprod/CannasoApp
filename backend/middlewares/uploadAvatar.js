// backend/middlewares/uploadAvatar.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 🔐 Ruta segura y absoluta a la carpeta de destino
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Desde este archivo => subimos 2 niveles hasta la raíz => luego a frontend/cannaso-app/public/assets/avatars
const rutaDestino = path.resolve(__dirname, "../../frontend/cannaso-app/public/assets/avatars");

if (!fs.existsSync(rutaDestino)) {
  fs.mkdirSync(rutaDestino, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, rutaDestino);
  },
  filename: (req, file, cb) => {
    const nombreUnico = `${Date.now()}-${file.originalname}`;
    cb(null, nombreUnico);
  },
});

const upload = multer({ storage });

export default upload;
