# Estándares de desarrollo

## Objetivo

Aplicar buenas prácticas de desarrollo de forma consistente en todo el proyecto. El código debe ser fácil de entender, revisar, probar y extender, y respetar la arquitectura definida.

## Organización del proyecto

- Mantener la estructura de `npm workspaces` y la organización del monorepo.
- Seguir la arquitectura definida para cada aplicación.
- Mantener una estructura de carpetas clara y predecible. Evitar dependencias directas entre capas que no estén autorizadas por la arquitectura.
- Priorizar la reutilización de lógica compartida sobre la duplicación.

## Separación de responsabilidades

- Mantener cada módulo, componente, función y servicio enfocado en una responsabilidad clara.
- Separar la presentación de la lógica de negocio y del acceso a datos.
- Mantener las llamadas HTTP y la persistencia detrás de servicios; evitar distribuir estas responsabilidades entre componentes de UI.
- En el servidor, dejar la orquestación HTTP en las rutas y controladores y la lógica de negocio en los servicios de dominio.

## Nombres y legibilidad

- Usar nombres descriptivos, consistentes y acordes con la responsabilidad de archivos, módulos, variables, funciones y componentes.
- Seguir las convenciones de nomenclatura ya establecidas por el lenguaje y el proyecto.
- Preferir código directo y fácil de leer frente a construcciones innecesariamente complejas.
- Añadir comentarios o documentación cuando aclaren decisiones, restricciones o comportamientos no obvios; no comentar código que se explique por sí mismo.

## Tipado y validaciones

- Aplicar TypeScript con tipado estricto y aprovechar los tipos compartidos para contratos entre cliente y servidor.
- Evitar `any` y los tipos o conversiones inseguros; modelar explícitamente los datos y estados posibles.
- Validar las entradas en los límites del sistema, incluidas las solicitudes HTTP, antes de usarlas en la lógica de negocio.
- Mantener los DTOs de solicitudes y respuestas alineados entre cliente y servidor.

## Estado y manejo de errores

- Representar explícitamente los estados relevantes de carga, éxito y error; evitar estados ambiguos.
- Manejar los errores de forma explícita y consistente. No ocultarlos ni devolver resultados que aparenten éxito cuando una operación falla.
- Proporcionar información de error adecuada al contexto: feedback claro para el usuario y respuestas HTTP coherentes para el cliente.
- La recarga del navegador (F5) debe rehidratar inmediatamente la sesión y el saldo desde `LocalStorage`.

## Seguridad

- Tratar los datos recibidos del cliente como no confiables y validarlos antes de procesarlos.
- No exponer secretos ni información sensible en el código cliente, respuestas, registros o mensajes de error.
- Mantener la configuración sensible fuera del código fuente y aplicar las políticas CORS definidas por el proyecto.

## Interfaz y dependencias

- En el frontend, utilizar únicamente componentes de `@mui/material` y `@mui/icons-material` para la interfaz gráfica.
- Evitar añadir dependencias que dupliquen capacidades ya disponibles en el stack del proyecto.

## Pruebas y flujo de trabajo

- Añadir pruebas unitarias para la lógica relevante y mantener la cobertura adecuada para el comportamiento implementado.
- Seguir el flujo de trabajo Trunk-Based Development y usar Conventional Commits.
- No considerar una funcionalidad completa sin validar sus rutas de éxito y error relevantes.

## Documentación
- Añadir comentarios o documentación cuando aclaren decisiones, restricciones o comportamientos no obvios; no comentar código que se explique por sí mismo.
- Añadir los bloques correspondientes para la documentación del API en Swagger.
