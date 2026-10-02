# Guía de desarrollo de Slow Rush

## ¿Qué es un monorepo?

Un monorepo es un único repositorio que contiene varios proyectos relacionados. En Slow Rush viven juntos el cliente web, la API y un paquete de tipos compartidos:

```text
.
├── packages/
│   ├── client/    # Aplicación web React
│   ├── server/    # API REST Express
│   └── shared/    # Paquete TypeScript reutilizable
├── .devcontainer/ # Configuración de GitHub Codespaces
├── package.json   # Workspaces y comandos raíz
└── tsconfig.json  # Opciones TypeScript comunes
```

Esta organización permite instalar dependencias una sola vez, ejecutar o validar las aplicaciones desde la raíz y mantener sus configuraciones en un mismo lugar. Cada proyecto conserva su propio `package.json` y sus opciones específicas.

## Configuración del monorepo y TypeScript

### npm workspaces

El `package.json` raíz declara `packages/*` como workspaces. Así, npm reconoce cliente, servidor y paquete compartido como paquetes del mismo repositorio. Las dependencias se instalan con `npm install` desde la raíz y el archivo `package-lock.json` registra una resolución reproducible para todo el monorepo.

Los workspaces locales se identifican como `@slow-rush/client`, `@slow-rush/server` y `@slow-rush/shared`. Cliente y servidor declaran una dependencia del paquete compartido mediante `@slow-rush/shared`; de esta manera podrán consumir contratos comunes sin copiarlos.

### Configuración TypeScript común

El archivo raíz `tsconfig.json` define las reglas que comparten los proyectos:

- `strict` habilita el modo estricto de TypeScript.
- `noUncheckedIndexedAccess` hace explícita la posibilidad de obtener un valor indefinido al acceder por índice.
- `forceConsistentCasingInFileNames` evita diferencias de mayúsculas/minúsculas en imports entre sistemas operativos.
- `noEmit` evita que la configuración raíz genere archivos JavaScript por sí sola.
- `target: ES2022` establece la versión ECMAScript objetivo.

Cada paquete tiene su propio `tsconfig.json`, que extiende el raíz y agrega las opciones de su entorno:

- **Cliente:** usa `moduleResolution: "Bundler"`, `jsx: "react-jsx"` y bibliotecas de navegador (`DOM`). Vite procesa los módulos y JSX.
- **Servidor:** usa `NodeNext` para resolución de módulos compatible con Node y genera JavaScript y declaraciones en `dist`.
- **Shared:** también compila como módulo `NodeNext`; genera JavaScript y declaraciones `.d.ts` para su punto de entrada.

Los comandos de comprobación son independientes del comando de desarrollo. `npm run dev` inicia los procesos; `npm run typecheck` ejecuta el chequeo de tipos de todos los workspaces y `npm run build` compila cada paquete que tenga un script de build.

## Cliente web

### Objetivo actual

El cliente es una aplicación de una sola página (SPA) construida con React, TypeScript y Vite. Esta etapa entrega el esqueleto para desarrollar la interfaz por módulos, no las funcionalidades de producto. La pantalla actual solo muestra el nombre Slow Rush y el texto “Aplicación lista para configurar”.

### Inicio y renderizado

1. `index.html` proporciona el elemento `#root` y carga `src/main.tsx`.
2. `main.tsx` localiza el elemento raíz; si no existe, lanza un error explícito.
3. React renderiza la aplicación dentro de `StrictMode`.
4. `ThemeProvider` aplica el tema global de MUI y `CssBaseline` normaliza los estilos base.
5. `BrowserRouter` deja disponible el contexto de React Router. Las rutas de producto todavía no se han implementado.
6. `App.tsx` renderiza el placeholder mediante `Container` y `Typography` de MUI.

### Dependencias de interfaz

- **React y React DOM:** estructura y renderizado de la interfaz.
- **Vite y `@vitejs/plugin-react`:** servidor de desarrollo rápido y build del cliente.
- **MUI (`@mui/material`):** componentes de interfaz y sistema de temas.
- **MUI Icons (`@mui/icons-material`):** paquete de iconos para futuras vistas.
- **Emotion:** motor de estilos requerido por MUI.
- **React Router:** base para navegación de la SPA.
- **`@slow-rush/shared`:** paquete local previsto para DTOs y tipos que deban compartirse con la API.

### Estructura preparada

Dentro de `packages/client/src` se reservaron estas ubicaciones:

- `assets/`: recursos estáticos.
- `config/`: configuración global; actualmente contiene `theme.ts`.
- `core/components/` y `core/layouts/`: componentes y composiciones reutilizables.
- `services/storage/`: futura abstracción de `LocalStorage`.
- `modules/auth/`: componentes, contexto y hooks de autenticación.
- `modules/dashboard/`: componentes y mocks de dashboard.
- `modules/snailpay/`: componentes, hooks y servicios de pasarela.
- `routes/`: configuración de navegación.

Las carpetas de módulos y servicios todavía no contienen comportamiento funcional. Los archivos `.gitkeep` existen para conservar esas carpetas vacías en Git.

### Configuración y comandos del cliente

`vite.config.ts` registra el plugin de React. El script de desarrollo escucha en `0.0.0.0:5173`, lo que permite acceder desde el host o desde un puerto reenviado en Codespaces. `npm run build --workspace=@slow-rush/client` comprueba tipos y genera el bundle de producción en `dist`; `npm run typecheck --workspace=@slow-rush/client` ejecuta únicamente el chequeo de tipos.

## API y paquete compartido

El servidor es un workspace Express con TypeScript. Su configuración separa el arranque, la aplicación Express y las opciones de entorno. `PORT` selecciona el puerto (por defecto `3000`) y `CLIENT_ORIGIN` determina el origen permitido por CORS (por defecto `http://localhost:5173`). `packages/server/.env.example` documenta ambas variables.

Actualmente `GET /health` es el único endpoint implementado y responde `{"status":"ok"}`. Las carpetas para middlewares y para rutas, controladores y servicios de SnailPay están preparadas, pero todavía no contienen lógica de negocio.

`packages/shared` establece el nombre y punto de entrada del paquete común. Su compilación produce archivos JavaScript y declaraciones de tipos bajo `dist`; el directorio `src/types` está reservado para contratos futuros y, por ahora, no declara tipos de dominio.

## GitHub Codespaces y ejecución

`.devcontainer/devcontainer.json` configura una imagen de desarrollo con Node 22, ejecuta `npm install` al crear el contenedor y reenvía los puertos `5173` y `3000`.

Desde la raíz del repositorio:

```sh
npm install
npm run dev
```

`npm run dev` levanta ambos procesos en paralelo. Las URLs locales son:

- Cliente: <http://localhost:5173>
- API: <http://localhost:3000>
- Comprobación de salud: <http://localhost:3000/health>

También se puede iniciar cada aplicación por separado:

```sh
npm run dev:client
npm run dev:server
```

Para verificar el scaffolding completo:

```sh
npm run typecheck
npm run build
```

## Alcance actual

La base técnica permite arrancar el cliente y la API y desarrollar ambos con TypeScript estricto en el mismo monorepo. Todavía no están implementados el registro o inicio de sesión, las rutas protegidas, dashboard, persistencia de sesión en `LocalStorage`, operaciones de SnailPay, validación de solicitudes, manejo global de errores ni simulación de caos.
