# Slow Rush

Monorepo de Slow Rush con npm workspaces. La estructura contiene el cliente React/Vite, la API Express y el paquete TypeScript compartido.

Consulta la [guía de desarrollo](docs/guia-desarrollo.md) para conocer la estructura del monorepo, las configuraciones TypeScript y el propósito de los proyectos.

## Requisitos

- Node.js 20.19 o posterior
- npm 10 o posterior

## Desarrollo local

Instala las dependencias desde la raíz:

```sh
npm install
```

Inicia cliente y servidor en paralelo:

```sh
npm run dev
```

- Cliente: <http://localhost:5173>
- API: <http://localhost:3000>
- Salud de la API: <http://localhost:3000/health>

También puedes iniciar cada aplicación por separado con `npm run dev:client` o `npm run dev:server`.

## Validación

```sh
npm run build
npm run typecheck
```

El scaffolding solo incluye una vista placeholder y un endpoint de salud; autenticación, dashboard, pagos y persistencia todavía no están implementados.