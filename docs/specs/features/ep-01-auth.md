# Épica 01: Gestión de identidad y sesión de usuario

## Objetivo

Permitir el registro, la autenticación y el control de acceso seguro de los usuarios dentro de la aplicación, usando almacenamiento local.

---

## Feature 1.1: Registro de usuarios local

### US-01: Registro de nuevo usuario

- Clasificación: MVP

#### Descripción

Como usuario nuevo,
quiero registrar mis datos personales y credenciales en un formulario,
para crear una cuenta en la plataforma e iniciar a interactuar con la solución.

#### Condiciones iniciales (precondiciones)

- El usuario no debe contar con una sesión activa.
- El usuario se encuentra en la pantalla inicial de registro.

#### Criterios de aceptación

- CA-01 (Campos obligatorios): el formulario debe solicitar obligatoriamente: nombre completo, correo electrónico, contraseña y confirmación de contraseña.
- CA-02 (Validación de formularios): se debe validar que el correo tenga un formato válido (`usuario@dominio.com`) y que la contraseña coincida exactamente con la confirmación.
- CA-03 (Archivos adjuntos): el formulario no debe solicitar ni permitir la carga de archivos adjuntos.
- CA-04 (Saldo inicial): todo usuario registrado correctamente debe inicializar su cuenta con un saldo automático de $0.
- CA-05 (Persistencia inicial): los datos del registro deben almacenarse localmente para permitir inicios de sesión posteriores.

---

## Feature 1.2: Control de acceso y sesión

### US-02: Inicio de sesión de usuario

- Clasificación: MVP

#### Descripción

Como usuario registrado,
quiero ingresar mis credenciales de correo y contraseña,
para acceder a mi panel principal de la aplicación.

#### Condiciones iniciales

- Debe existir un usuario previamente registrado.
- El usuario está en la vista de inicio de sesión.

#### Criterios de aceptación

- CA-01 (Autenticación exitosa): al ingresar el correo y la contraseña registrados correctamente, la aplicación debe redirigir al usuario al dashboard.
- CA-02 (Credenciales inválidas): si el correo o la contraseña no coinciden con los datos almacenados, el sistema debe mostrar un mensaje claro de error sin permitir el acceso.

### US-03: Persistencia de sesión y protección de rutas

- Clasificación: MVP

#### Descripción

Como usuario autenticado,
quiero que mi sesión se mantenga activa al recargar la página o navegar y que los usuarios no autenticados no entren al dashboard,
para no perder mi estado dentro de la plataforma ni exponer mis datos.

#### Condiciones iniciales

- El usuario intenta navegar en la plataforma o recargar la pestaña del navegador.

#### Criterios de aceptación

- CA-01 (Persistencia tras reload): si el usuario refresca la página (F5/reload), la sesión activa, los datos del perfil y el saldo deben conservarse mediante `LocalStorage`.
- CA-02 (Protección del dashboard): si un usuario no autenticado intenta acceder a la ruta del dashboard mediante URL directa, la aplicación debe redirigirlo automáticamente a la vista de login.

### US-04: Cierre de sesión

- Clasificación: MVP

#### Descripción

Como usuario con sesión activa,
quiero disponer de una opción para cerrar mi sesión,
para proteger mis datos cuando finalice el uso de la aplicación.

#### Condiciones iniciales

- El usuario tiene una sesión activa dentro del dashboard.

#### Criterios de aceptación

- CA-01 (Acción de logout): al hacer clic en la opción de "Cerrar sesión", el estado de autenticación activo debe destruirse.
- CA-02 (Redirección): el usuario debe ser redirigido inmediatamente a la pantalla de inicio de sesión.
- CA-03 (Acceso posterior): intentar regresar al dashboard con el botón "Atrás" del navegador no debe permitir ver información privada sin autenticarse de nuevo.
