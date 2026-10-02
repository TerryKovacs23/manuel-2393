import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { app } from '../src/app.js';

let baseUrl = '';
let server: ReturnType<typeof app.listen> | undefined;

beforeAll(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');

  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  const activeServer = server;
  if (!activeServer) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    activeServer.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /health returns the API status', async () => {
  const response = await fetch(`${baseUrl}/health`);

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok' });
});