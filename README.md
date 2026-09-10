# MOVE SMART

Sistema web académico para el análisis y optimización simulada de rutas de transporte público urbano.

MOVE SMART permite analizar escenarios simulados de movilidad urbana con el propósito de apoyar la toma de decisiones relacionadas con la optimización de rutas de transporte público.

Actualmente, el proyecto se encuentra en un proceso de **optimización, estandarización y containerización mediante Docker y Docker Compose**, con el objetivo de conseguir un entorno reproducible y compatible con Linux.

---

## 📋 Información general

| Información | Detalle |
|---|---|
| **Proyecto** | MOVE SMART |
| **Autores** | Brandon Berrio Agudelo |
| **Fecha de inicio** | 06/08/2026 |
| **Fecha de finalización** | 10/09/2026 |
| **Ciudad objetivo** | Manizales, Colombia |
| **Duración estimada** | 1 mes |
| **Tipo** | Proyecto académico |
| **Metodología** | SCRUM / Kanban / GitHub Projects |

---

# 🎯 Objetivo

Analizar escenarios simulados de movilidad urbana para apoyar la toma de decisiones en la optimización de rutas de transporte público.

El sistema integra información relacionada con:

- Rutas.
- Paradas.
- Zonas críticas.
- Usuarios.
- Escenarios de movilidad.

La información puede ser consultada y gestionada mediante una aplicación web que permite representar los datos y preparar posteriormente los escenarios de optimización.

---

# 🧩 Tecnologías

## Frontend

- React JS
- Vite
- Axios
- Chart.js
- Recharts
- Leaflet
- Nginx

## Backend

- Node.js
- Express
- JavaScript
- API REST
- JWT
- bcryptjs
- mysql2

## Base de datos

- MySQL 8.4
- Scripts SQL de inicialización
- Volumen persistente de Docker

## Infraestructura

- Docker
- Docker Compose
- Redes Docker
- Nginx
- Contenedores independientes para frontend, backend y base de datos

## Administración

- phpMyAdmin como herramienta visual para la administración y comprobación de la base de datos durante el desarrollo y la sustentación académica.

---

# 🏗️ Arquitectura actual

La aplicación está organizada en frontend, backend y base de datos.

Adicionalmente, phpMyAdmin se utiliza como herramienta auxiliar para administrar visualmente MySQL.

```text
                         MOVE SMART

                              │
                       Docker Compose
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
      FRONTEND             BACKEND              MYSQL
   React + Nginx        Node + Express         MySQL 8.4
       :80                  :4000                :3306
          │                   │                   │
          │                   └───────────────────┘
          │
          ▼
      Navegador

                              ▲
                              │
                         Administración
                              │
                              ▼
                         phpMyAdmin
                            :8081
```

La arquitectura técnica completa se encuentra documentada en:

`docs/architecture.md`

---

# 🌐 Puertos

| Servicio | Puerto interno | Puerto del host |
|---|---:|---:|
| Frontend / Nginx | 80 | 3000 |
| Backend / Express | 4000 | 4000 |
| MySQL | 3306 | 3306 |
| phpMyAdmin | 80 | 8081 |

Durante el desarrollo sin Docker, Vite puede ejecutarse normalmente en el puerto `5173`.

En el entorno Dockerizado, Nginx sirve el frontend mediante el puerto `80` del contenedor, publicado como `3000` en el host.

> La exposición del puerto `3306` corresponde a la configuración actual de desarrollo académico. Para producción se recomienda mantener MySQL únicamente dentro de la red interna de Docker.

---

# 🐳 Ejecución mediante Docker

## Requisitos

- Docker
- Docker Compose

No es necesario instalar Node.js ni MySQL directamente en el equipo para ejecutar la versión containerizada.

---

## Configuración de variables de entorno

El proyecto utiliza un archivo `.env` en la raíz para la configuración utilizada por Docker Compose y el backend.

Crear el archivo a partir de:

```text
.env.example
```

Por ejemplo:

```bash
cp .env.example .env
```

Configurar las variables necesarias antes de iniciar los servicios.

Las variables reales no deben almacenarse en Git.

---

# 🚀 Construcción del proyecto

Desde la raíz del proyecto:

```bash
docker compose build
```

---

# ▶️ Inicio de los servicios

```bash
docker compose up -d
```

También es posible construir e iniciar directamente:

```bash
docker compose up -d --build
```

---

# 🔎 Verificación de los servicios

```bash
docker compose ps
```

Los servicios principales son:

```text
movesmart-frontend
movesmart-backend
movesmart-mysql
movesmart-phpmyadmin
```

MySQL dispone de un `healthcheck` para verificar su disponibilidad.

---

# ❤️ Health Check

El backend dispone del endpoint:

```http
GET /health
```

Disponible en:

```text
http://localhost:4000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "movesmart-backend"
}
```

---

# 🗄️ Base de datos

La estructura de la base de datos se encuentra en:

```text
backend/sql/schema.sql
```

Los datos iniciales se encuentran en:

```text
backend/sql/seed.sql
```

Docker utiliza estos archivos durante la inicialización de MySQL.

La base de datos utilizada por MOVE SMART es:

```text
move_smart_db
```

---

# 💾 Persistencia

MySQL utiliza un volumen Docker denominado:

```text
mysql_data
```

El volumen se monta en:

```text
/var/lib/mysql
```

Esto permite conservar los datos aunque los contenedores sean detenidos o recreados.

### Detener los servicios

```bash
docker compose down
```

Los contenedores se eliminan, pero el volumen se conserva.

### Eliminar también los datos

```bash
docker compose down -v
```

Este comando elimina los volúmenes y provoca una nueva inicialización de MySQL.

> ⚠️ Debe utilizarse con precaución porque elimina los datos persistidos.

---

# 🌐 Acceso

## Frontend

```text
http://localhost:3000
```

## Backend

```text
http://localhost:4000
```

## Health Check

```text
http://localhost:4000/health
```

## phpMyAdmin

```text
http://localhost:8081
```

---

# 👥 Roles

MOVE SMART maneja tres roles:

- `admin`
- `gestor`
- `ciudadano`

El registro público crea usuarios como `ciudadano`.

Las operaciones administrativas requieren autenticación y autorización mediante roles.

La información detallada sobre autenticación y autorización se encuentra en:

`docs/security.md`

---

# 📚 Documentación

La documentación del proyecto se encuentra organizada de la siguiente manera:

| Archivo | Contenido |
|---|---|
| `README.md` | Descripción general, ejecución y acceso |
| `backend/README.md` | Arquitectura y funcionamiento del backend |
| `frontend/README.md` | Arquitectura y funcionamiento del frontend |
| `docs/architecture.md` | Arquitectura, Docker, redes, persistencia e infraestructura |
| `docs/security.md` | Autenticación, autorización, roles y seguridad |

---

# 📁 Estructura del proyecto

```text
Proyecto-MoveSmart/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── sql/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── .env.example
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   └── security.md
│
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

# 🎓 Estado del proyecto

MOVE SMART cuenta actualmente con:

- Frontend desarrollado en React.
- Backend desarrollado en Node.js y Express.
- Base de datos MySQL 8.4.
- API REST.
- Autenticación mediante JWT.
- Hash de contraseñas mediante bcryptjs.
- Control de acceso basado en roles.
- Inicialización declarativa mediante scripts SQL.
- Persistencia mediante volumen Docker.
- Containerización mediante Docker Compose.
- Nginx para servir el frontend.
- phpMyAdmin para administración visual de MySQL.

La documentación técnica, de arquitectura y seguridad se encuentra separada en los documentos correspondientes dentro de `docs/`.