import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import mongoose from 'mongoose';

const getDbPath = () => {
  let basePath;
  switch (process.platform) {
    case 'win32':
      basePath = path.join(process.env.APPDATA, 'NombreDeLaApp', 'mongodb');
      break;
    case 'darwin':
      basePath = path.join(process.env.HOME, 'Library', 'Application Support', 'NombreDeLaApp', 'mongodb');
      break;
    case 'linux':
      basePath = path.join(process.env.HOME, '.NombreDeLaApp', 'mongodb');
      break;
    default:
      throw new Error('Unsupported platform');
  }

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  return basePath;
};

const mongoServer = new MongoMemoryServer({
  instance: {
    dbPath: getDbPath(),
    storageEngine: 'wiredTiger',
  },
});

const connectDB = async () => {
  await mongoServer.start();
  const uri = mongoServer.getUri();
  console.log(`MongoDB running at ${uri}`);

  // Conectar con Mongoose
  await mongoose.connect(uri, {
  });

  return uri;
};

export default connectDB;
