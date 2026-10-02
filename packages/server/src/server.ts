import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.info(`Slow Rush API escuchando en http://localhost:${env.port}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  console.error(`No se pudo iniciar Slow Rush API en el puerto ${env.port}.`, error);
  process.exitCode = 1;
});
