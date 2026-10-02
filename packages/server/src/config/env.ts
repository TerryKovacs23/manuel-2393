import 'dotenv/config';

const portValue = process.env.PORT ?? '3000';
const port = Number(portValue);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`PORT debe ser un entero entre 1 y 65535; se recibió "${portValue}".`);
}

export const env = {
  port,
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
};
