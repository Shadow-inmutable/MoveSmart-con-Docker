# Seguridad de MOVE SMART

## 1. Objetivo

Este documento describe los mecanismos de autenticación, autorización, protección de credenciales y control de acceso implementados en MOVE SMART.

También identifica las medidas necesarias para fortalecer el sistema antes de un despliegue productivo.

---

# 2. Principios de seguridad

MOVE SMART aplica los siguientes principios:

- Autenticación de usuarios.
- Autorización basada en roles.
- Separación entre registro público y administración.
- Hash de contraseñas.
- Protección de endpoints administrativos.
- Uso de variables de entorno para información sensible.
- Restricción de funcionalidades según el rol del usuario.

---

# 3. Autenticación

La autenticación utiliza JSON Web Tokens (JWT).

El flujo de autenticación es:

```text
USUARIO
   │
   │ email + password
   ▼
POST /api/usuarios/login
   │
   ▼
BACKEND
   │
   ├── Consulta usuario
   │
   ├── Verifica contraseña
   │
   └── Genera JWT
           │
           ▼
        CLIENTE
```

El cliente utiliza posteriormente el token para acceder a recursos protegidos.

---

# 4. JWT

El backend utiliza una clave secreta almacenada mediante variable de entorno:

```env
JWT_SECRET=
```

La clave no debe almacenarse directamente en el código fuente.

El token contiene información asociada al usuario, incluyendo:

```text
id
email
rol
```

El backend establece una duración limitada para el token.

---

# 5. Autorización basada en roles

La autenticación determina quién es el usuario.

La autorización determina qué puede hacer ese usuario.

MOVE SMART utiliza tres roles:

```text
admin
gestor
ciudadano
```

La autorización se implementa mediante middleware.

Flujo:

```text
Petición
   │
   ▼
verificarToken
   │
   ▼
Usuario autenticado
   │
   ▼
requireRole(...)
   │
   ├── Autorizado ──────► Controlador
   │
   └── No autorizado ──► 403
```

---

# 6. Roles del sistema

## 6.1 Ciudadano

El ciudadano puede:

- Registrarse.
- Iniciar sesión.
- Consultar información disponible.

No puede realizar operaciones administrativas.

---

## 6.2 Gestor

El gestor puede acceder a las funcionalidades operativas autorizadas relacionadas con:

- Rutas.
- Paradas.
- Zonas críticas.
- Consulta de información.

No puede administrar usuarios.

---

## 6.3 Administrador

El administrador posee los permisos administrativos.

Puede:

- Gestionar usuarios.
- Crear ciudadanos.
- Crear gestores.
- Actualizar usuarios.
- Eliminar usuarios.
- Gestionar funcionalidades administrativas.

---

# 7. Registro público

El endpoint:

```http
POST /api/usuarios/register
```

está destinado al registro público.

Los usuarios creados mediante este endpoint reciben automáticamente:

```text
ciudadano
```

El usuario no puede utilizar el registro público para crear:

```text
admin
gestor
```

Esto evita que una persona pueda elevar sus privilegios mediante el formulario de registro.

---

# 8. Creación administrativa de usuarios

La creación administrativa utiliza:

```http
POST /api/usuarios/crear-admin
```

Este endpoint requiere autenticación y rol:

```text
admin
```

El administrador puede crear:

```text
ciudadano
gestor
```

La separación entre:

```text
/register
```

y:

```text
/crear-admin
```

permite diferenciar claramente el registro público de la administración de usuarios.

---

# 9. Matriz de permisos

|        Acción          | Ciudadano | Gestor | Admin |
|---|:---:|:---:|:---:|
|    Registrarse         | ✅ | — | — |
|    Iniciar sesión      | ✅ | ✅ | ✅ |
|  Consultar información | ✅ | ✅ | ✅ |
|     Gestionar rutas    | ❌ | ✅ | ✅ |
|   Gestionar paradas    | ❌ | ✅ | ✅ |
|Gestionar zonas críticas| ❌ | ✅ | ✅ |
|     Ver usuarios       | ❌ | ❌ | ✅ |
|    Crear ciudadano     | ❌ | ❌ | ✅ |
|     Crear gestor       | ❌ | ❌ | ✅ |
|  Actualizar usuarios   | ❌ | ❌ | ✅ |
|      Cambiar roles     | ❌ | ❌ | ✅ |
|   Eliminar usuarios    | ❌ | ❌ | ✅ |

| Función            | admin | gestor | ciudadano |
| ------------------ | :---: | :----: | :-------: |
| Login              |   ✅   |    ✅   |     ✅     |
| Dashboard          |   ✅   |    ✅   |     ❌     |
| Consultar rutas    |   ✅   |    ✅   |     ✅*    |
| Crear ruta         |   ✅   |    ✅   |     ❌     |
| Editar ruta        |   ✅   |    ✅   |     ❌     |
| Eliminar ruta      |   ✅   |    ✅   |     ❌     |
| Crear zona         |   ✅   |    ✅   |     ❌     |
| Editar zona        |   ✅   |    ✅   |     ❌     |
| Eliminar zona      |   ✅   |    ✅   |     ❌     |
| Crear parada       |   ✅   |    ✅   |     ❌     |
| Editar parada      |   ✅   |    ✅   |     ❌     |
| Eliminar parada    |   ✅   |    ✅   |     ❌     |
| Gestionar usuarios |   ✅   |    ❌   |     ❌     |

                    CIUDADANO   GESTOR   ADMIN
                    ─────────   ──────   ─────
GET rutas              ✅          ✅       ✅
GET zonas              ✅          ✅       ✅
GET paradas            ✅          ✅       ✅

POST rutas             ❌          ✅       ✅
PUT rutas              ❌          ✅       ✅
DELETE rutas           ❌          ✅       ✅

POST zonas             ❌          ✅       ✅
PUT zonas              ❌          ✅       ✅
DELETE zonas           ❌          ✅       ✅

POST paradas           ❌          ✅       ✅
PUT paradas            ❌          ✅       ✅
DELETE paradas         ❌          ✅       ✅

GET usuarios           ❌          ❌       ✅
POST crear usuario     ❌          ❌       ✅
PUT usuario            ❌          ❌       ✅
DELETE usuario         ❌          ❌       ✅



---

# 10. Endpoints administrativos

Los endpoints administrativos deben utilizar autenticación y autorización.

Ejemplo:

```text
POST /api/usuarios/crear-admin
GET  /api/usuarios
PUT  /api/usuarios/:id
DELETE /api/usuarios/:id
```

El flujo de autorización es:

```text
Cliente
   │
   ▼
JWT
   │
   ▼
verificarToken
   │
   ▼
requireRole('admin')
   │
   ▼
Controlador
```

---

# 11. Contraseñas

Las contraseñas no se almacenan directamente en texto plano.

El backend utiliza:

```text
bcryptjs
```

para generar un hash de la contraseña antes de almacenarlo.

Durante el inicio de sesión:

```text
Contraseña proporcionada
          │
          ▼
     bcrypt.compare
          │
          ▼
Hash almacenado
```

---

# 12. Variables de entorno

Las variables sensibles se mantienen fuera del código fuente.

Entre ellas:

```env
DB_PASSWORD=
JWT_SECRET=
```

La configuración de ejemplo se documenta mediante:

```text
.env.example
backend/.env.example
frontend/.env.example
```

Los archivos `.env` reales no deben almacenarse en el repositorio.

---

# 13. Protección de secretos

Los secretos no deben incluirse directamente en:

- Código fuente.
- Dockerfiles.
- Imágenes Docker.
- Archivos públicos.
- Repositorios Git.

El archivo:

```text
.env
```

debe estar incluido en `.gitignore`.

---

# 14. .dockerignore

Los archivos `.dockerignore` deben evitar que información sensible sea enviada al contexto de construcción.

Como mínimo:

```text
node_modules/
.env
.git/
```

De esta forma se evita introducir innecesariamente:

- Dependencias locales.
- Credenciales.
- Historial Git.
- Archivos locales.

---

# 15. Ejecución no privilegiada

La rúbrica del proyecto establece que los contenedores no deben ejecutar la aplicación como `root`.

Por esta razón, los Dockerfiles definitivos deben establecer un usuario no privilegiado en las etapas de ejecución.

La comprobación puede realizarse mediante:

```bash
docker compose exec backend whoami
```

y:

```bash
docker compose exec frontend whoami
```

El resultado debe corresponder a un usuario sin privilegios administrativos.

---

# 16. Superficie de red

La comunicación interna utiliza:

```text
movesmart_network
```

El backend accede a MySQL mediante:

```text
mysql:3306
```

phpMyAdmin también accede mediante:

```text
mysql:3306
```

La comunicación interna no debe utilizar:

```text
localhost
```

para referirse a otros contenedores.

---

# 17. MySQL

MySQL almacena información del sistema y debe permanecer protegido frente a accesos externos innecesarios.

Actualmente se utiliza:

```text
MySQL 8.4
```

La comunicación interna utiliza:

```text
mysql:3306
```

La configuración actual publica el puerto `3306` durante el desarrollo académico.

Para producción se recomienda:

```text
MySQL
   │
   └── solamente red interna Docker
```

sin publicar `3306` en el host.

---

# 18. phpMyAdmin

phpMyAdmin se utiliza como herramienta administrativa para facilitar:

- Consulta de tablas.
- Verificación de registros.
- Inspección de relaciones.
- Comprobación de la inicialización de la base de datos.

Actualmente se encuentra disponible en:

```text
http://localhost:8081
```

Para producción se recomienda restringir su acceso o retirarlo del entorno público.

---

# 19. CORS

El backend utiliza una política CORS configurada mediante:

```env
CORS_ORIGIN=http://localhost:3000
```

Esto permite que el frontend publicado en el puerto `3000` pueda comunicarse con la API.

En producción, el origen debe modificarse para utilizar únicamente el dominio autorizado.

---

# 20. Riesgos identificados

Antes de considerar MOVE SMART listo para producción deben revisarse:

- Ejecución de contenedores como usuario no privilegiado.
- Exposición del puerto MySQL.
- Gestión segura de secretos.
- HTTPS.
- Restricción de phpMyAdmin.
- Política CORS de producción.
- Rotación de `JWT_SECRET`.
- Backups.
- Protección de almacenamiento de archivos.
- Monitoreo y registro de eventos.

---

# 21. Camino a producción

La arquitectura de seguridad recomendada para producción sería:

```text
                         INTERNET
                             │
                             ▼
                     HTTPS / PROXY
                             │
                             ▼
                         FRONTEND
                             │
                             ▼
                          BACKEND
                         /       \
                        /         \
                       ▼           ▼
                    MYSQL       S3 / Floci
                   PRIVADO
```

Las principales medidas serían:

1. Utilizar HTTPS.
2. Mantener MySQL en una red privada.
3. No publicar el puerto `3306`.
4. Restringir phpMyAdmin.
5. Gestionar secretos mediante un sistema seguro.
6. Utilizar un `JWT_SECRET` robusto.
7. Automatizar backups.
8. Utilizar almacenamiento de objetos para archivos.
9. Configurar CORS únicamente para los dominios autorizados.
10. Ejecutar los contenedores con usuarios no privilegiados.



*flujo del manejo de la seguridad* (/esto tambien lo nececesito explicar en la exposicion)

Necesitamos hacer que el frontend obtenga y gestione el JWT automáticamente después del login, y que api.js lo envíe en las peticiones protegidas.

api.js ya tiene parte de esto implementado porque tiene el interceptor que busca:

const token = localStorage.getItem('token');

                    ┌───────────────┐
                    │     Login     │
                    │ email/password│
                    └───────┬───────┘
                            │
                            │ POST /api/usuarios/login
                            ▼
                    ┌───────────────┐
                    │    Backend    │
                    │   Express     │
                    └───────┬───────┘
                            │
                     valida usuario
                            │
                            ▼
                       genera JWT
                            │
                            ▼
                    ┌───────────────┐
                    │    Frontend   │
                    │ guarda token  │
                    └───────┬───────┘
                            │
                            ▼
                  /dashboard
                            │
                            ▼
              api.js agrega automáticamente
                     Authorization: Bearer JWT
                            │
                            ▼
                    Backend verifica JWT
                            │
                            ▼
                       Dashboard

Eso es exactamente lo que necesitamos para que Postman deje de ser necesario para el acceso normal del sistema.

Tu Login.jsx hace correctamente estas tres cosas:

const { data } = await api.post('/usuarios/login', { email, password });

Obtiene el JWT:

localStorage.setItem('token', data.token);

Y guarda los datos del usuario:

localStorage.setItem('user', JSON.stringify(data.user));

Luego redirige según el rol:

if (['admin', 'gestor'].includes(data.user.rol)) {
    navigate('/dashboard');
}

Además, ProtectedRoute.jsx comprueba:

token ✓
usuario ✓
rol permitido ✓

Y api.js automáticamente agrega:

Authorization: Bearer <JWT>

a las peticiones.

Por tanto, la arquitectura que tenes es:

Login.jsx
   │
   │ email + password
   ▼
POST /api/usuarios/login
   │
   ▼
Backend
   │
   │ JWT
   ▼
Login.jsx
   │
   ├── localStorage.token
   └── localStorage.user
            │
            ▼
       /dashboard
            │
            ▼
     ProtectedRoute
            │
            ▼
        Dashboard
            │
            ▼
         api.js
            │
            │ Authorization: Bearer JWT
            ▼
         Backend

pero necesitamos confirmar que el backend realmente está protegiendo las rutas del Dashboard con verificarToken y los roles correspondientes.

Porque hay dos niveles diferentes:

Frontend

ProtectedRoute.jsx evita que un usuario entre visualmente a:

/dashboard

sin autorización.

Backend

authMiddleware.js y roleMiddleware.js deben impedir que alguien simplemente haga:

GET /api/rutas

sin un JWT válido.

## FLujo para cada rol: 

*Para un administrador:*

http://localhost:3000
        │
        ▼
      Login
        │
        │ admin@...
        │ contraseña
        ▼
POST /api/usuarios/login
        │
        ▼
       JWT
        │
        ▼
 localStorage
        │
        ▼
 /dashboard
        │
        ▼
ProtectedRoute
        │
        ├── token ✓
        ├── user ✓
        └── rol = admin ✓
        │
        ▼
    Dashboard

*Para un gestor:*

Login
  │
  ▼
JWT
  │
  ▼
ProtectedRoute
  │
  └── rol = gestor ✓
          │
          ▼
      Dashboard

*Para un ciudadano:*

Login
  │
  ▼
JWT
  │
  ▼
rol = ciudadano
  │
  ▼
/

*Y si alguien intenta entrar directamente:*

http://localhost:3000/dashboard

**sin sesión:**

/dashboard
      │
      ▼
ProtectedRoute
      │
      ▼
    /login

*La comunicación en Docker queda:*


Navegador
   │
   │ http://localhost:3000
   ▼
Frontend/Nginx
   │
   │ código React ejecutándose en navegador
   │
   │ http://localhost:4000/api
   ▼
Backend


porque backend solamente es resoluble entre contenedores Docker.

La comunicación queda:

Navegador
   │
   │ http://localhost:3000
   ▼
Frontend/Nginx
   │
   │ código React ejecutándose en navegador
   │
   │ http://localhost:4000/api
   ▼
Backend

Mientras que internamente Docker tiene:

backend ──────► mysql:3306


## Flujo completo:*

┌──────────────┐
│    LOGIN     │
│ /login       │
└──────┬───────┘
       │ POST /api/usuarios/login
       ▼
┌──────────────────────┐
│ Backend              │
│ verifica email/pass  │
│ genera JWT            │
└──────────┬───────────┘
           │ token + user
           ▼
┌──────────────────────┐
│ localStorage         │
│ token                │
│ user { rol, ... }    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ProtectedRoute       │
│ verifica sesión/rol  │
└──────────┬───────────┘
           │
      admin / gestor
           │
           ▼
┌──────────────────────┐
│     Dashboard        │
└──────────┬───────────┘
           │
           │ api.get(...)
           ▼
┌──────────────────────┐
│ api.js interceptor   │
│ Authorization:       │
│ Bearer <JWT>         │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ verificarToken       │
│ requireRole(...)      │
│      Backend         │
└──────────────────────┘

**Por tanto:**

| Endpoint               | JWT | Rol                 |
| ---------------------- | --- | ------------------- |
| `POST /register`       | ❌   | Público → ciudadano |
| `POST /login`          | ❌   | Público             |
| `POST /crear-admin`    | ✅   | admin               |
| `GET /usuarios`        | ✅   | admin               |
| `PUT /usuarios/:id`    | ✅   | admin               |
| `DELETE /usuarios/:id` | ✅   | admin               |
Es la administracion correcta del manojeo de los JWT y el manejo de los Tokens

LOGIN
  │
  │ email + contraseña
  ▼
POST /api/usuarios/login
  │
  ▼
Backend genera JWT
  │
  ├── token
  └── user { id, nombre, email, rol }
  │
  ▼
localStorage
  │
  ▼
/dashboard
  │
  ▼
ProtectedRoute
  │
  ├── admin ──┐
  │           │
  └── gestor ─┤
              ▼
          DASHBOARD
              │
              ▼
            api.js
              │
              │ Authorization: Bearer JWT
              ▼
           Backend

Eso es exactamente lo que queremos para una aplicación web con autenticación JWT.