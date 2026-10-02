# Reglas de Generación de Código
1. No alterar la estructura `npm workspaces`.
2. Frontend: Aplicar Feature-First Architecture. Separar estrictamente UI, módulos (auth, dashboard, snailpay), capa de servicios de LocalStorage y enrutamiento[span_11](start_span)[span_11](end_span).
3. Frontend: Utilizar únicamente componentes de `@mui/material` y `@mui/icons-material` para la interfaz gráfica[span_20](start_span)[span_20](end_span).
3. Backend: API REST stateless. Separar configuración, middlewares (validación, manejo de errores, chaos engineering) y controlador/servicio para SnailPay[span_12](start_span)[span_12](end_span).
4. Flujo de Trabajo: Trunk-Based Development y Conventional Commits[span_13](start_span)[span_13](end_span)[span_14](start_span)[span_14](end_span).
5. Calidad: Aplicar tipado estricto, separación de responsabilidades y manejo de errores consistente[span_15](start_span)[span_15](end_span).