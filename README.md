# Slow Rush

Monorepo de Slow Rush con npm workspaces. La estructura contiene el cliente React/Vite, la API Express y el paquete TypeScript compartido.

## Requisitos

- Node.js 20.19 o posterior
- npm 10 o posterior

## Instalación

Desde la raíz del proyecto:

```sh
npm install
```

## Arranque del proyecto

Ejecuta ambas apps en paralelo:

```sh
npm run dev
```

Esto levantará:

- Cliente: http://localhost:5173
- API: http://localhost:3000
- Health check: http://localhost:3000/health

También puedes arrancar cada app por separado:

```sh
## Requisitos
npm run dev:server
```

- Git
## Estructura general
## Instalación en desarrollo local
```text
Clona el repositorio, entra a la carpeta del proyecto e instala las dependencias desde la raíz del monorepo:
├── client/
│   ├── src/
git clone <url-del-repositorio>
cd manuel-2393
│   └── tests/
├── server/
│   ├── src/
### Levantar cliente y servidor juntos
├── shared/
Desde la raíz, inicia ambas aplicaciones en paralelo:
└── ...
```

## Flujo de trabajo recomendado

El cliente queda disponible en `http://localhost:5173` y la API en `http://localhost:3000`. El endpoint de estado es `http://localhost:3000/health`.

### Levantar cada aplicación por separado

Abre una terminal para cada proceso. Ambos comandos se ejecutan desde la raíz:

```sh
npm run dev:server
```

```sh
npm run dev:client
```

El cliente llama a `/api/*`; Vite reenvía esas solicitudes al servidor local en el puerto 3000 y elimina el prefijo `/api`. Por ejemplo, `GET /api/health` en el cliente llega a `GET /health` en Express.

## Desarrollo en GitHub Codespaces

1. Abre el repositorio en un Codespace.
2. En una terminal de la raíz, instala las dependencias:

	```sh
	npm install
	```

3. Levanta ambas aplicaciones:

	```sh
	npm run dev
	```

4. En la pestaña **Ports**, abre el puerto `5173` en el navegador. Vite está enlazado a `0.0.0.0` y su proxy accede al servidor por `localhost:3000` dentro del Codespace.

También es posible iniciar cliente y servidor en terminales separadas con `npm run dev:client` y `npm run dev:server`. El puerto `3000` se puede abrir para consultar directamente `/health` o `/api-docs`; para el uso normal, entra por el puerto `5173`.

## Pruebas y validaciones

Los tests están declarados por workspace y se ejecutan desde la raíz:

```sh
npm test
npm test --workspace=@slow-rush/client
npm test --workspace=@slow-rush/server
```

El comando `npm test` recorre los scripts de prueba disponibles en los workspaces; cada paquete utiliza su propio `vitest.config.ts` y ejecuta únicamente sus pruebas.

Validaciones completas:

```sh
npm run check
npm run typecheck
npm run lint
npm run build
```

- `npm run check`: comprobación de tipos, lint y pruebas.
- `npm run typecheck`: comprobación de tipos para los workspaces.
- `npm run lint`: ESLint en los workspaces.
- `npm run build`: compila `shared`, luego `server` y finalmente `client`.

Para iniciar solo una aplicación o ejecutar comandos dentro de un workspace, npm también admite:

```sh
npm run dev --workspace=@slow-rush/client
npm run dev --workspace=@slow-rush/server
npm run build --workspace=@slow-rush/client
```

## Estructura general

```text
packages/
├── client/
│   ├── src/
│   └── tests/
├── server/
│   ├── src/
│   └── tests/
├── shared/
│   └── src/
└── ...
```