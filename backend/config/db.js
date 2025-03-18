import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import mongoose from 'mongoose';
import keytar from 'keytar';

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

  process.env.MONGOMS_DOWNLOAD_URL = binaryPath;

  console.log(`Usando binario local: ${binaryPath}`);

  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbPath: getDbPath(),
      dbName: DB_NAME,
      auth: true, // Habilitar autenticación
    },
    binary: {
      version: 'latest',
      skipMD5: true,
    },
  });

  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    authSource: 'admin',
    user: 'admin',
    pass: password,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

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