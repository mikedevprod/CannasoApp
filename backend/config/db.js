import path from 'path';
import { fileURLToPath } from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_NAME = 'CannasoPerla';

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

const connectDB = async () => {
  const binaryPath = path.join(__dirname, '../bin/mongodb', process.platform === 'win32' ? 'mongod.exe' : 'mongod');

  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbPath: getDbPath(),
      dbName: DB_NAME,
      auth: false,
      port: 60420,
    },
    binary: {
      path: binaryPath,
      download: false,
    },
  });

  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log(`MongoDB running at ${uri}`);
  return uri;
};

export { connectDB };
