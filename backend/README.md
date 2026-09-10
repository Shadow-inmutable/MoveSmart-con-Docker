# MOVE SMART — Backend

Backend de MOVE SMART desarrollado con Node.js y Express.

El backend proporciona la API REST utilizada por el frontend para la autenticación, gestión de usuarios y administración de la información relacionada con rutas, paradas y zonas críticas.

---

# 🧩 Tecnologías

- Node.js
- Express
- JavaScript
- API REST
- MySQL
- mysql2
- JWT
- bcryptjs
- CORS
- Docker

---

# 🏗️ Estructura

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── usuariosController.js
│   └── ...
│
├── middlewares/
│   ├── attachDB.js
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── routes/
│   ├── usuariosRoutes.js
│   └── rutasRoutes.js
│
├── sql/
│   ├── schema.sql
│   └── seed.sql
│
├── index.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .env.example
└── README.md
```

---

# 🔌 API REST

La API se encuentra disponible mediante:

```text
http://localhost:4000/api
```

Los principales recursos son:

```text
/api/usuarios
/api/rutas
```

---

# ❤️ Health Check

El backend proporciona:

```http
GET /health
```

Disponible en:

```text
http://localhost:4000/health
```

Respuesta:

```json
{
  "status": "ok",
  "service": "movesmart-backend"
}
```

---

# 🔐 Autenticación

La autenticación se implementa mediante JSON Web Tokens (JWT).

Flujo:

```text
Cliente
   │
   │ POST /api/usuarios/login
   ▼
Backend
   │
   ├── Busca usuario
   ├── Valida contraseña
   └── Genera JWT
          │
          ▼
       Cliente
          │
          ▼
    Token de acceso
```

El token se utiliza posteriormente para acceder a endpoints protegidos.

Las peticiones autenticadas utilizan:

```http
Authorization: Bearer <token>
```

---

# 👥 Roles

El sistema utiliza los siguientes roles:

```text
admin
gestor
ciudadano
```

La autorización se realiza mediante middleware.

---

# 👤 Usuarios

## Registro público

```http
POST /api/usuarios/register
```

El registro público crea usuarios con rol:

```text
ciudadano
```

---

## Inicio de sesión

```http
POST /api/usuarios/login
```

Permite validar las credenciales y obtener un JWT.

---

## Crear usuario desde administración

```http
POST /api/usuarios/crear-admin
```

Este endpoint está destinado a usuarios administradores.

Permite crear:

```text
ciudadano
gestor
```

---

## Listar usuarios

```http
GET /api/usuarios
```

---

## Actualizar usuario

```http
PUT /api/usuarios/:id
```

---

## Eliminar usuario

```http
DELETE /api/usuarios/:id
```

Las operaciones administrativas están protegidas mediante autenticación y autorización por rol.

---

# 🚌 Rutas

El recurso principal de movilidad es:

```text
/api/rutas
```

El backend gestiona información relacionada con:

- Rutas.
- Paradas.
- Zonas críticas.

Los endpoints específicos se encuentran definidos en:

```text
backend/routes/rutasRoutes.js
```

---

# 🗄️ Base de datos

El backend utiliza MySQL.

Dentro de Docker, el backend se conecta al servicio MySQL mediante:

```text
mysql:3306
```

La configuración utiliza:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=move_smart_db
```

La comunicación interna es:

```text
Backend
   │
   │ mysql:3306
   ▼
MySQL
```

---

# 🗃️ Inicialización de la base de datos

El esquema se encuentra en:

```text
sql/schema.sql
```

Los datos iniciales se encuentran en:

```text
sql/seed.sql
```

Estos archivos son utilizados por Docker durante la inicialización de MySQL.

---

# ⚙️ Variables de entorno

La plantilla del backend se encuentra en:

```text
backend/.env.example
```

Variables principales:

```env
PORT=4000
NODE_ENV=production

DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=move_smart_db

JWT_SECRET=

CORS_ORIGIN=http://localhost:3000
```

El archivo real `.env` se mantiene fuera del repositorio.

---

# 🐳 Docker

El backend dispone de:

```text
Dockerfile
.dockerignore
```

El servicio se ejecuta mediante Docker Compose.

Construcción:

```bash
docker compose build backend
```

Inicio:

```bash
docker compose up -d backend
```

Logs:

```bash
docker compose logs backend
```

Estado:

```bash
docker compose ps
```

---

# 🔎 Comprobación

Health Check:

```bash
curl http://localhost:4000/health
```

La respuesta esperada es:

```json
{
  "status": "ok",
  "service": "movesmart-backend"
}
```

---

# 🔒 Seguridad

El backend utiliza:

- JWT para autenticación.
- bcryptjs para hash de contraseñas.
- Middleware de autenticación.
- Middleware de autorización por roles.
- Variables de entorno.
- CORS.
- Validación de datos de entrada.

La documentación completa se encuentra en:

```text
docs/security.md
```