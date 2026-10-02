# Especificación de arquitectura de solución: monolito modular

## 1. Diseño general de la solución

- **Patrón arquitectónico:** monolito modular basado en *features* dentro de una estructura monorepo con proxy de Vite.
- **Stack de tecnologías:**
  - **Frontend (client):** React, TypeScript, Material UI (MUI) y Vite.
  - **Backend (server):** Express y TypeScript.
  - **Paquete compartido (shared):** paquete local de TypeScript para tipado estricto y DTOs.

## 2. Arquitectura de proyectos y aplicaciones

### 2.1. Paquete compartido: `packages/shared`

Aísla las definiciones de tipos y los contratos de datos reutilizables entre el cliente y el servidor, sin duplicar código. Contiene:

- Interfaces de los modelos.
- Data Transfer Objects (DTOs) para las solicitudes y respuestas.
- Tipos para los estados de transacción.

### 2.2. Aplicación cliente: `packages/client`

Está diseñada con el enfoque *Feature-First Architecture*, que divide la interfaz y el estado por dominio funcional.

- **Capa Core / Presentación general:** componentes reutilizables de UI y estructuras de maquetación (*layouts*).
- **Capa de módulos (*features*):** conjunto de modulos por dominios funcionales.
- **Capa de servicios y persistencia:** abstracción unificada y fuertemente tipada para las operaciones de lectura y escritura en `LocalStorage`.
- **Capa de enrutamiento:** control de la navegación y *guards* para restringir el acceso a vistas protegidas.

### 2.3. Aplicación servidor: `packages/server`

Está diseñada como una API REST sin estado (*stateless*), desacoplada en módulos de servicio.

- **Capa de configuración:** gestión de variables de entorno y políticas CORS.
- **Capa de middlewares:**
  - Validación estricta de esquemas de entrada para solicitudes HTTP.
  - Manejador global de excepciones y formateador de errores HTTP.
- **Capa de módulos (*features*):** conjunto de modulos por dominios funcionales.
  - **Rutas:** definición de *endpoints* HTTP REST.
  - **Controlador:** orquestación de peticiones y respuestas HTTP.
  - **Servicio de dominio:** Lógica de negocio de cada modulo.

## 3. Estructura de directorios del monorepo

```text
.devcontainer/
packages/
├── shared/
│   └── src/
│       └── types/
├── client/
│   └── src/
│       ├── assets/
│       ├── config/
│       ├── core/
│       │   ├── components/
│       │   ├── layouts/
│       │   └── theme/
│       ├── services/
│       │   └── storage/
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── components/
│       │   │   ├── context/
│       │   │   └── hooks/
│       │   ├── dashboard/
│       │   │   ├── components/
│       │   │   └── mocks/
│       │   └── snailpay/
│       │       ├── components/
│       │       ├── hooks/
│       │       └── services/
│       └── routes/
└── server/
    └── src/
        ├── config/
        ├── middlewares/
        └── modules/
            └── snailpay/
```
