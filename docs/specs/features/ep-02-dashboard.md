# Épica 02: Dashboard y visualización de información simulada

## Objetivo

Ofrecer una interfaz visual clara y resumida que muestre métricas del usuario y estadísticas del entorno de carreras.

---

## Feature 2.1: Informes del perfil

### US-05: Consulta de perfil y saldo actual

- Clasificación: Full

#### Descripción

Como usuario autenticado,
quiero visualizar mi nombre y mi saldo disponible en el Dashboard,
para conocer el estado de mi cuenta en todo momento.

#### Condiciones iniciales

- El usuario ha iniciado sesión correctamente.
- El usuario se encuentra ubicado en el Dashboard.

#### Criterios de aceptación

- CA-01 (Datos de perfil): se debe desplegar de forma visible el Nombre Completo del usuario logueado.
- CA-02 (Saldo en tiempo real): se debe mostrar el valor del saldo actual formateado como moneda. Tras el registro inicial, este monto debe indicar $0.

---

## Feature 2.2: Métricas de juego y carreras

### US-06: Gráfica donut de historial de apuestas

- Clasificación: Full

#### Descripción

Como usuario del Dashboard,
quiero ver una gráfica tipo donut de apuestas ganadas vs. perdidas,
para analizar el rendimiento histórico acumulado.

#### Condiciones iniciales

- El usuario visualiza el Dashboard principal.

#### Criterios de aceptación

- CA-01 (Tipo de gráfica): la interfaz debe renderizar un componente gráfico tipo donut, usando cualquier librería visual.
- CA-02 (Simulación de datos): los datos mostrados (apuestas ganadas vs. perdidas) deben ser simulados pero numéricamente congruentes.
- CA-03 (Exclusión de lógica de apuesta): no se debe implementar formulario para realizar apuestas reales ni procesadores de juego.

### US-07: Gráfica de barras de victorias de caracoles

- Clasificación: Full

#### Descripción

Como usuario del Dashboard,
quiero visualizar una gráfica de barras que represente las victorias de los caracoles en un día simulado,
para conocer las estadísticas de desempeño de los competidores.

#### Condiciones iniciales

- El usuario está dentro del Dashboard.

#### Criterios de aceptación

- CA-01 (Competidores): debe incluir la representación de 6 caracoles con nombres personalizables.
- CA-02 (Carreras simuladas): la gráfica debe reflejar los resultados acumulados de 6 carreras realizadas en el día simulado.
- CA-03 (Tipo de gráfica): debe presentarse en formato de gráfica de barras de fácil lectura.
