# Especificaciones generales del proyecto.

- **Entorno de ejecución y desarrollo:** GitHub Codespaces y desarrollo local.
- **Estrategia de ramificación:** Trunk-Based Development con Conventional Commits.
- **Modelo de Negocio:** Casa de apuestas de carreras de caracoles.
- **Nombre de la sulución:** Slow Rush.
- **UI/UX:** `Material UI (MUI)`.
- **Persistencia:** El servidor Express no puede o debe conectar con bases de datos ni persistir datos en disco. Usaremos `LocalStorage` en el cliente para conservar la sesión, el perfil, el saldo y la trazabilidad de transacciones.