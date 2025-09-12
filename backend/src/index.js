import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded from the backend directory regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectToDatabase } from './config/db.js';
import { notFoundHandler, errorHandler } from './utils/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import plantRoutes from './routes/plantRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import participantRoutes from './routes/participantRoutes.js';

const app = express();

app.use(helmet());

const allowedFromEnv = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // non-browser or same-origin
    
    // Allow localhost for development
    const isLocalhost = /^http:\/\/localhost:\d{4,5}$/.test(origin);
    
    // Allow Vercel domains (both old and new)
    const isVercel = /^https:\/\/.*\.vercel\.app$/.test(origin);
    
    // Allow specific domains from environment
    const isAllowedDomain = allowedFromEnv.includes(origin) || allowedFromEnv.includes('*');
    
    if (isLocalhost || isVercel || isAllowedDomain) {
      return callback(null, true);
    }
    
    console.log(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'CRaftGardening API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });



