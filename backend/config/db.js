import path from 'path';
import { fileURLToPath } from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import mongoose from 'mongoose';
import keytar from 'keytar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_NAME = 'NombreDeLaApp';

const getDbPath = () => {
  let basePath;
  switch (process.platform) {
    case 'win32':
      basePath = path.join(process.env.APPDATA, DB_NAME, 'mongodb');
      break;
    case 'darwin':
      basePath = path.join(process.env.HOME, 'Library', 'Application Support', DB_NAME, 'mongodb');
      break;
    case 'linux':
      basePath = path.join(process.env.HOME, `.${DB_NAME}`, 'mongodb');
      break;
    default:
      throw new Error('Unsupported platform');
  }

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  return basePath;
};

const isDbPasswordSet = async () => {
  const password = await keytar.getPassword(DB_NAME, 'db-password');
  return !!password;
};

const getCredentials = async () => {
  try {
    const password = await keytar.getPassword(DB_NAME, 'db-password');
    return password;
  } catch (error) {
    console.warn('No se ha definido una contraseña para la base de datos');
    return null;
  }
};

const connectDB = async () => {
  const password = await getCredentials();

  if (!password) {
    console.warn('MongoDB no arrancará hasta que se defina una contraseña');
    return;
  }

  const binaryPath = path.join(__dirname, '../bin/mongodb', process.platform === 'win32' ? 'mongod.exe' : 'mongod');

  console.log(`Usando binario local: ${binaryPath}`);

  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbPath: getDbPath(),
      dbName: DB_NAME,
      auth: false, // Desactivar autenticación temporalmente
      port: 60420
    },
    binary: {
      path: binaryPath, // Configurar la ruta directamente al binario
      download: false, // Evitar que descargue el binario
    },
  });

  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  console.log(`MongoDB running at ${uri}`);

  return uri;
};

// Escuchar cambios en la contraseña y reiniciar MongoDB automáticamente
const watchForPasswordChange = () => {
  fs.watch(__dirname, async (eventType, filename) => {
    if (filename === 'db-password' && eventType === 'change') {
      console.log('Contraseña de MongoDB actualizada. Reiniciando conexión...');
      await connectDB();
    }
  });
};

export { connectDB, isDbPasswordSet, watchForPasswordChange };
