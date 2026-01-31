import express from 'express';
import cors from 'cors';
import { analyzeHandler } from './handlers/analyze.js';
import { healthHandler } from './handlers/health.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/analyze', analyzeHandler);
app.get('/api/health', healthHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
