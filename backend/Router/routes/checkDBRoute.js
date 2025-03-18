import express from 'express';
import { isDbPasswordSet } from '../../config/db.js';

const checkDBRoute = express.Router();

checkDBRoute.get('/check-db', async (req, res) => {
  try {
    const isPasswordSet = await isDbPasswordSet();
    res.status(200).json({ isPasswordSet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default checkDBRoute;
