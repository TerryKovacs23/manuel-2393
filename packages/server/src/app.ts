import express from 'express';
import { corsMiddleware } from './config/cors.js';

export const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});
