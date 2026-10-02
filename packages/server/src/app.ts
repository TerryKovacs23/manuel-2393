import express from 'express';
import { corsMiddleware } from './config/cors.js';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './config/openapi.js';
export const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Comprueba el estado de la API
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: La API está disponible.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - status
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - ok
 *             example:
 *               status: ok
 */
app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});
