# MOVE SMART

Sistema web académico para el análisis y optimización simulada de rutas de transporte público urbano.

MOVE SMART permite analizar escenarios simulados de movilidad urbana con el propósito de apoyar la toma de decisiones relacionadas con la optimización de rutas de transporte público.

Actualmente, el proyecto se encuentra en un proceso de **optimización, estandarización y containerización mediante Docker y Docker Compose**, con el objetivo de conseguir un entorno reproducible y compatible con Linux.

---

## 📋 Información general

| Información               | Detalle                                       |
| ------------------------- | --------------------------------------------- |
| **Proyecto**              | MOVE SMART                                    |
| **Autores**               | Brandon Berrio Agudelo – Ángel Camilo Castaño |
| **Fecha de inicio**       | 27/01/2026                                    |
| **Fecha de finalización** | 03/03/2026                                    |
| **Ciudad objetivo**       | Manizales, Colombia                           |
| **Duración estimada**     | 1 mes                                         |
| **Tipo**                  | Proyecto académico                            |

---

# 🎯 Objetivo

Analizar escenarios simulados de movilidad urbana para apoyar la toma de decisiones en la optimización de rutas de transporte público.

El sistema busca integrar información relacionada con rutas, paradas y zonas de movilidad para facilitar el análisis de escenarios mediante herramientas de visualización y consulta de datos.

---

# 🧩 Tecnologías

### Frontend

* React JS
* Vite
* Axios
* Chart.js / Recharts
* Nginx para servir la aplicación en producción

### Backend

* Node.js
* Express
* JavaScript
* API REST
* JWT para autenticación

### Base de datos

* MySQL 8.4
* Scripts SQL de inicialización
* Volumen persistente de Docker

### Infraestructura

* Docker
* Docker Compose
* Nginx
* Redes Docker
* Contenedores independientes para frontend, backend y base de datos

### Metodología

* SCRUM
* Kanban
* GitHub Projects

---

# 🏗️ Arquitectura actual objetivo

La arquitectura objetivo del proyecto estará compuesta por tres servicios principales:

```text
                    MOVE SMART
                         │
                 Docker Compose
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      FRONTEND        BACKEND           DB
    React + Nginx   Node + Express    MySQL 8.4
       :80             :4000           :3306
```

Desde el computador del usuario:

```text
PC / NAVEGADOR
      │
      ├── http://localhost:3000
      │          │
      │          ▼
      │      FRONTEND
      │      Nginx :80
      │
      └── http://localhost:4000
                 │
                 ▼
              BACKEND
           Node + Express
                 │
                 │ db:3306
                 ▼
               MySQL
```

### Puertos

| Servicio          | Puerto interno | Puerto del host |
| ----------------- | -------------: | --------------: |
| Frontend / Nginx  |             80 |            3000 |
| Backend / Express |           4000 |            4000 |
| MySQL             |           3306 |            3306 |

> Durante el desarrollo sin Docker, Vite puede ejecutarse normalmente en el puerto `5173`. En el entorno Dockerizado de producción, Nginx sirve el frontend mediante el puerto `80` del contenedor, publicado como `3000` en el host.

---

# 🐳 Arquitectura Docker

El proyecto utilizará **un único archivo `docker-compose.yml` ubicado en la raíz**.

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
│   ├── .env
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   └── ...
│
├── docs/
│
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
```

La estructura de servicios será:

```text
docker-compose.yml
        │
        ├───────────────┐
        │               │
        ▼               ▼
    frontend          backend
 React + Nginx     Node + Express
     :80               :4000
                        │
                        │
                        ▼
                       db
                     MySQL
                     :3306
```

Los servicios estarán conectados mediante una red interna de Docker:

```text
                 movesmart-network
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    frontend        backend           db
       │               │              │
       │               └──────────────┘
       │                    db:3306
       │
       └── navegador
```

---

# 💾 Persistencia de MySQL

La base de datos utilizará un volumen persistente:

```text
Docker
   │
   ▼
mysql_data
   │
   ▼
/var/lib/mysql
   │
   ▼
Datos de MOVE SMART
```

Esto permite que los datos sobrevivan a la eliminación de los contenedores.

### `docker compose down`

Elimina los contenedores, pero conserva el volumen:

```text
docker compose down
```

```text
Contenedores → eliminados
Volumen      → conservado
Datos        → conservados
```

### `docker compose down -v`

Elimina también los volúmenes:

```text
docker compose down -v
```

```text
Contenedores → eliminados
Volúmenes    → eliminados
Datos        → eliminados
```

> ⚠️ Durante las pruebas, `docker compose down -v` debe utilizarse con precaución, ya que elimina los datos almacenados en la base de datos Docker.

---

# 🔐 Variables de entorno

MOVE SMART separará la configuración de infraestructura de las variables propias del backend y frontend.

## `.env` raíz

El archivo ubicado en la raíz será utilizado principalmente por Docker Compose.

Ejemplo:

```env
MYSQL_ROOT_PASSWORD=movesmart_dev
MYSQL_DATABASE=move_smart_db
```

## `backend/.env`

Configuración utilizada por Node.js y Express:

```env
PORT=4000
NODE_ENV=development

DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=movesmart_dev
DB_NAME=move_smart_db

JWT_SECRET=CAMBIAR_ESTE_SECRETO
CORS_ORIGIN=http://localhost:3000
```

### Importante: `DB_HOST=db`

Dentro de Docker, el backend no debe utilizar:

```env
DB_HOST=localhost
```

porque `localhost` dentro del contenedor representa al propio contenedor del backend.

En cambio:

```env
DB_HOST=db
```

hace referencia al servicio MySQL definido en `docker-compose.yml`.

```text
backend
    │
    │ db:3306
    ▼
   MySQL
```

## `frontend/.env`

La aplicación React utilizará una variable para definir la URL de la API:

```env
VITE_API_URL=http://localhost:4000/api
```

De esta forma, las peticiones del navegador se dirigirán al backend:

```text
React
  │
  ▼
http://localhost:4000/api
  │
  ▼
Express
```

---

# 🛡️ Seguridad de variables

Los archivos `.env` con credenciales reales no deben almacenarse en GitHub.

El proyecto utilizará:

```text
.env
.env.example
```

El archivo `.env` contendrá los valores reales y permanecerá fuera del repositorio.

El archivo `.env.example` servirá como plantilla:

```env
PORT=4000
NODE_ENV=development

DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=move_smart_db

JWT_SECRET=
CORS_ORIGIN=http://localhost:3000
```

El `.gitignore` deberá impedir el seguimiento de los archivos `.env`, manteniendo disponibles los archivos `.env.example`.

---

# 🗄️ Inicialización de la base de datos

La imagen oficial de MySQL permite ejecutar automáticamente scripts SQL durante la inicialización de una base de datos nueva mediante:

```text
/docker-entrypoint-initdb.d/
```

La estrategia prevista será:

```text
backend/sql/
      │
      │ montaje Docker
      ▼
/docker-entrypoint-initdb.d/
      │
      ▼
     MySQL
```

Antes de implementar esta estrategia se debe auditar el contenido de:

```text
backend/sql/
```

y revisar:

```text
backend/migrate-to-mysql.js
```

El objetivo es determinar claramente si `migrate-to-mysql.js`:

* crea tablas;
* ejecuta migraciones;
* inserta datos;
* importa información;
* realiza una tarea que ya será reemplazada por los scripts SQL de Docker.

Se debe evitar ejecutar simultáneamente procesos que creen o inserten los mismos datos.

---

# 🐋 Dockerización del Backend

El backend será convertido en un contenedor independiente.

```text
backend/
├── Dockerfile
└── .dockerignore
```

El proceso esperado será:

```text
Dockerfile
    │
    ▼
Node.js
    │
    ├── npm ci
    │
    ▼
Dependencias
    │
    ▼
npm start
    │
    ▼
Express :4000
```

El backend estará disponible desde el host mediante:

```text
http://localhost:4000
```

---

# 🌐 Dockerización del Frontend

El frontend utilizará un Dockerfile multi-stage.

La estrategia será:

```text
Node.js
   │
   ├── npm ci
   │
   ├── npm run build
   │
   ▼
dist/
   │
   ▼
Nginx
   │
   ▼
Frontend producción
```

El objetivo es separar:

```text
ETAPA 1
Node.js
   ↓
compilación React/Vite

ETAPA 2
Nginx
   ↓
servir archivos estáticos
```

El contenedor Nginx escuchará en:

```text
:80
```

y Docker lo publicará en:

```text
localhost:3000
```

Por tanto:

```text
http://localhost:3000
        │
        ▼
   Nginx :80
        │
        ▼
React / dist
```

---

# 🔌 Comunicación entre servicios

La comunicación tendrá dos contextos diferentes.

## Desde el navegador

El navegador utiliza los puertos publicados en el host:

```text
Browser
   │
   ├── localhost:3000 → Frontend
   │
   └── localhost:4000 → Backend
```

## Desde el backend

El backend utiliza el nombre del servicio Docker:

```text
Backend
   │
   │ db:3306
   ▼
 MySQL
```

Por lo tanto, no se debe utilizar:

```text
Backend → localhost:3306
```

sino:

```text
Backend → db:3306
```

---

# 🔄 Servicios del Frontend

Los servicios de React deberán centralizar el acceso a la API.

Estructura prevista:

```text
frontend/src/
│
├── api/
│   └── api.js
│
└── services/
    ├── authService.js
    ├── rutasService.js
    ├── zonasService.js
    └── paradasService.js
```

Actualmente existe una posible inconsistencia entre el uso de:

```text
Axios
```

y:

```text
fetch()
```

La arquitectura objetivo será:

```text
Componente React
       │
       ▼
    Service
       │
       ▼
     api.js
       │
       ▼
     Axios
       │
       ▼
localhost:4000/api
       │
       ▼
    Express
```

Esto permitirá centralizar aspectos como:

* URL base;
* encabezados;
* autenticación;
* JWT;
* interceptores;
* manejo de errores.

La implementación definitiva se realizará después de auditar los servicios actuales.

---

# 🧪 Estrategia de pruebas

La validación se realizará progresivamente.

## Backend → Base de datos

Primero se verificará:

```text
Backend
   │
   ▼
db:3306
   │
   ▼
MySQL
```

Se revisarán los logs:

```bash
docker compose logs backend
```

y se comprobará que la conexión con MySQL sea exitosa.

---

## API

Posteriormente se probarán los endpoints existentes mediante navegador o Postman.

Ejemplos:

```text
/api/usuarios
/api/rutas
...
```

La lista definitiva de endpoints será determinada a partir de las rutas reales del proyecto.

---

## Frontend → Backend

Después se probará:

```text
React
   │
   ▼
Axios / Service
   │
   ▼
localhost:4000/api
   │
   ▼
Express
   │
   ▼
MySQL
```

Se verificarán las funcionalidades principales:

* Login.
* Rutas.
* Paradas.
* Zonas.
* Dashboard.
* Mapas.
* Gráficas.
* Consultas a la base de datos.

---

# ❤️ Healthcheck de MySQL

El backend no debe asumir que MySQL está disponible inmediatamente después de iniciar el contenedor.

La estrategia será:

```text
MySQL inicia
    │
    ▼
Healthcheck
    │
    ▼
MySQL READY
    │
    ▼
Backend
```

Docker Compose utilizará `healthcheck` y una dependencia condicionada para mejorar el proceso de arranque.

---

# 🚀 Comandos principales

Una vez finalizada la configuración Docker:

### Construir imágenes

```bash
docker compose build
```

### Iniciar servicios

```bash
docker compose up
```

### Iniciar en segundo plano

```bash
docker compose up -d
```

### Ver estado

```bash
docker compose ps
```

### Ver logs

```bash
docker compose logs
```

### Ver logs del backend

```bash
docker compose logs backend
```

### Detener servicios

```bash
docker compose down
```

### Detener y eliminar volúmenes

```bash
docker compose down -v
```

> El último comando elimina los datos almacenados en los volúmenes Docker.

---

# 🛠️ Ruta de fases de optimización

La containerización y optimización de MOVE SMART se realizará de manera incremental.

```text
FASE 0  → Respaldar y establecer punto de partida
FASE 1  → Auditoría y preparación del proyecto
FASE 2  → Variables de entorno y seguridad
FASE 3  → Integración SQL + persistencia MySQL
FASE 4  → Dockerizar Backend
FASE 5  → Dockerizar Frontend + Nginx
FASE 6  → Docker Compose global
FASE 7  → Red y comunicación entre servicios
FASE 8  → Levantamiento controlado
FASE 9  → Pruebas Backend → DB
FASE 10 → Pruebas Frontend → Backend
FASE 11 → Pruebas integrales
FASE 12 → Preparación Linux/GitHub
FASE 13 → Documentación final
```

---

# 📌 FASE 0 — Punto de restauración

Antes de realizar cambios importantes se establecerá un punto de restauración mediante Git.

Desde la raíz:

```bash
cd Proyecto-MoveSmart
```

Verificar el estado:

```bash
git status
```

Guardar cambios importantes:

```bash
git add .
git commit -m "chore: estado inicial antes de optimizacion docker"
```

Verificar la rama:

```bash
git branch
```

El objetivo es poder regresar al estado anterior si alguna modificación introduce problemas.

---

# 🔍 FASE 1 — Auditoría y preparación

La primera fase tiene como objetivo conocer exactamente el funcionamiento actual del proyecto antes de realizar cambios.

Se revisarán:

* Rutas dependientes de Windows.
* Rutas `C:\...`.
* Variables de entorno.
* Archivos `.env`.
* Configuración de MySQL.
* Scripts de `package.json`.
* Permisos de archivos.
* Dependencias.
* Configuración de React.
* Configuración de Node.js y Express.
* Conexión frontend → backend.
* Conexión backend → MySQL.
* Puertos.
* Configuración existente de Docker.
* Diferencias entre mayúsculas y minúsculas en nombres de archivos y directorios.

También se comprobará especialmente la diferencia entre:

```text
middlewares/
```

y:

```text
Middlewares/
```

ya que Linux distingue entre mayúsculas y minúsculas.

---

# 🔐 FASE 2 — Variables de entorno y seguridad

Se centralizará la configuración necesaria y se eliminarán dependencias innecesarias de configuraciones locales.

Se revisarán:

```text
.env
backend/.env
frontend/.env
.env.example
.gitignore
```

Se garantizará que secretos como:

* contraseñas;
* JWT secrets;
* credenciales;

no sean enviados al repositorio.

---

# 🗃️ FASE 3 — SQL y persistencia MySQL

Se revisará:

```text
backend/sql/
backend/migrate-to-mysql.js
```

Se definirá un único mecanismo responsable de inicializar la base de datos.

Se implementará la persistencia mediante:

```text
mysql_data:/var/lib/mysql
```

También se verificará el comportamiento de los scripts SQL cuando el volumen sea nuevo o ya existente.

---

# 🐳 FASE 4 — Docker Backend

Se creará y validará:

```text
backend/Dockerfile
backend/.dockerignore
```

El objetivo será ejecutar Node.js + Express dentro de un contenedor independiente escuchando en:

```text
:4000
```

---

# 🌐 FASE 5 — Docker Frontend + Nginx

Se auditarán y ajustarán:

```text
frontend/Dockerfile
frontend/nginx.conf
frontend/.dockerignore
```

El Dockerfile utilizará un proceso multi-stage:

```text
Node
 ↓
npm ci
 ↓
npm run build
 ↓
dist
 ↓
Nginx
 ↓
Frontend
```

---

# 🧩 FASE 6 — Docker Compose global

Se utilizará un único:

```text
docker-compose.yml
```

ubicado en la raíz:

```text
Proyecto-MoveSmart/
└── docker-compose.yml
```

No se utilizará un Compose independiente para cada servicio.

La estructura objetivo será:

```text
docker-compose.yml
       │
       ├── frontend
       ├── backend
       └── db
```

---

# 🌐 FASE 7 — Red y comunicación

Se creará una red Docker para permitir la comunicación interna:

```text
movesmart-network
```

La comunicación interna será:

```text
backend → db:3306
```

Mientras que el acceso desde el navegador será:

```text
localhost:3000 → frontend
localhost:4000 → backend
```

---

# 🚦 FASE 8 — Levantamiento controlado

Se verificará progresivamente:

```bash
docker compose build
docker compose up
docker compose ps
```

El estado esperado será conceptualmente:

```text
frontend → running
backend  → running
db       → healthy
```

---

# 🧪 FASE 9 — Pruebas Backend → DB

Se verificará primero la conexión entre Node.js y MySQL.

```text
Backend
   │
   ▼
db:3306
   │
   ▼
MySQL
```

Se analizarán los logs del backend y de MySQL antes de continuar con el frontend.

---

# 🧪 FASE 10 — Pruebas Frontend → Backend

Se verificará:

```text
React
 ↓
Service
 ↓
Axios
 ↓
localhost:4000/api
 ↓
Express
```

Se comprobarán las funcionalidades existentes y las respuestas de la API.

---

# 🧪 FASE 11 — Pruebas integrales

Finalmente se comprobará el flujo completo:

```text
                    MOVE SMART

                     Navegador
                         │
                         ▼
                  localhost:3000
                         │
                         ▼
                  React + Nginx
                         │
                         │ HTTP API
                         ▼
                  localhost:4000
                         │
                         ▼
                  Node + Express
                         │
                         │ db:3306
                         ▼
                     MySQL 8.4
                         │
                         ▼
                    mysql_data
```

El objetivo es comprobar que el sistema funcione de extremo a extremo.

---

# 🐧 FASE 12 — Preparación para Linux y GitHub

Una vez estabilizada la aplicación Dockerizada, se verificará que MOVE SMART pueda ejecutarse fuera del entorno Windows original.

Flujo esperado:

```text
GitHub
   │
   ▼
Linux
   │
   ▼
git clone
   │
   ▼
Configurar .env
   │
   ▼
docker compose up
   │
   ▼
MOVE SMART
```

Se prestará especial atención a:

* Mayúsculas y minúsculas.
* Rutas.
* Permisos.
* Line endings.
* Variables de entorno.
* Dependencias.
* Docker.
* Docker Compose.

---

# 📚 FASE 13 — Documentación final

Cuando el sistema se encuentre estable, se actualizará la documentación del proyecto.

```text
docs/
├── introduccion.md
├── problema-solucion.md
├── objetivos-alcance.md
├── arquitectura.md
├── backlog.md
└── scrum.md
```

La documentación final incluirá:

* Arquitectura.
* Estructura del proyecto.
* Instalación.
* Variables de entorno.
* Docker.
* Docker Compose.
* Base de datos.
* Servicios.
* Puertos.
* Redes.
* Persistencia.
* Comandos.
* Pruebas.
* Compatibilidad con Linux.
* Despliegue.

---

# 📈 Estado de optimización

El proceso de transformación seguirá el siguiente flujo:

```text
Proyecto actual
      │
      ▼
Auditoría
      │
      ▼
Corrección de dependencias locales
      │
      ▼
Variables de entorno
      │
      ▼
SQL + persistencia
      │
      ▼
Docker Backend
      │
      ▼
Docker Frontend + Nginx
      │
      ▼
Docker Compose
      │
      ▼
Red interna
      │
      ▼
Healthchecks
      │
      ▼
Pruebas
      │
      ▼
Linux / GitHub
      │
      ▼
Documentación final
```

---

# ⚠️ Estrategia de trabajo

La optimización se realizará **por fases y de manera controlada**.

No se modificarán simultáneamente Docker Compose, SQL, frontend y backend sin haber auditado previamente los componentes correspondientes.

El orden de trabajo será:

```text
                 AUDITORÍA
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
       BACKEND               FRONTEND
          │                     │
          ▼                     ▼
 migrate-to-mysql        Docker / Nginx
          │                     │
          └──────────┬──────────┘
                     ▼
              Variables .env
                     │
                     ▼
               SQL + volumen
                     │
                     ▼
                 Dockerfiles
                     │
                     ▼
             Docker Compose
                     │
                     ▼
                    RED
                     │
                     ▼
                 PRUEBAS
                     │
                     ▼
                Linux/GitHub
                     │
                     ▼
             DOCUMENTACIÓN
```

El objetivo final es obtener una versión de MOVE SMART que sea:

* **Reproducible**.
* **Containerizada**.
* **Persistente**.
* **Compatible con Linux**.
* **Independiente de configuraciones locales de Windows**.
* **Configurable mediante variables de entorno**.
* **Preparada para GitHub**.
* **Documentada**.
* **Lista para futuras etapas de despliegue**.

---

## 🚀 Objetivo final de infraestructura

```text
                         INTERNET / USUARIO
                                │
                                ▼
                         ┌─────────────┐
                         │  NAVEGADOR  │
                         └──────┬──────┘
                                │
                         localhost:3000
                                │
                                ▼
                    ┌─────────────────────┐
                    │      FRONTEND       │
                    │   React + Nginx     │
                    │       :80           │
                    └──────────┬──────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌─────────────────────┐
                    │       BACKEND       │
                    │  Node.js + Express  │
                    │       :4000         │
                    └──────────┬──────────┘
                               │
                               │ db:3306
                               ▼
                    ┌─────────────────────┐
                    │      DATABASE       │
                    │      MySQL 8.4      │
                    │       :3306         │
                    └──────────┬──────────┘
                               │
                               ▼
                         mysql_data
                    Volumen persistente
```

**MOVE SMART** busca evolucionar desde una aplicación ejecutada directamente sobre el entorno local hacia una arquitectura reproducible mediante **Docker + Docker Compose**, manteniendo separadas las responsabilidades de frontend, backend y base de datos.
