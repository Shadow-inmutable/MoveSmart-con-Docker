# Proyecto-MoveSmart
Sistema web académico para el análisis y optimización simulada de rutas de transporte público urbano.

## Información general
- **Autores:** Brandon Berrio Agudelo – Ángel Camilo Castaño  
- **Fecha inicio:** 27/01/2026  
- **Fecha fin:** 03/03/2026  
- **Ciudad objetivo:** Manizales  
- **Duración:** 1 mes  

## Objetivo
Analizar escenarios simulados de movilidad urbana para apoyar la toma de decisiones en la optimización de rutas de transporte público.

## Tecnologías
- Frontend: React JS
- Backend: Node.js + Express
- Base de datos: MySQL
- Visualización: Chart.js / Recharts

## Metodología
SCRUM con tablero Kanban en GitHub Projects.

-----------------------------------------------------------------------------
### PREPARACION Y ADUITORIA:

Lo que sí debemos revisar es:

rutas escritas como C:\...
variables de entorno
configuración de MySQL
scripts de package.json
permisos de archivos
dependencias
configuración de React
configuración de Node/Express
archivos .env
conexión frontend → backend
conexión backend → MySQL
puertos
configuración de Docker

### contruccion de nuevas funcionalidades

                    ┌─────────────────────┐
                    │      NAVEGADOR      │
                    │   React + Chart.js  │
                    └──────────┬──────────┘
                               │
                         HTTP :3000
                               │
                    ┌──────────▼──────────┐
                    │      FRONTEND       │
                    │      React JS       │
                    │      Nginx          │
                    └──────────┬──────────┘
                               │
                         HTTP / API
                               │
                    ┌──────────▼──────────┐
                    │       BACKEND       │
                    │   Node.js + Express │
                    │        :4000        │
                    └──────────┬──────────┘
                               │
                         MySQL :3306
                               │
                    ┌──────────▼──────────┐
                    │      DATABASE       │
                    │        MySQL        │
                    │   volumen persist.  │
                    └─────────────────────┘


                                        INTERNET
                        │
                        ▼
                 ┌─────────────┐
                 │    NGINX    │
                 │ Reverse     │
                 │ Proxy       │
                 └──────┬──────┘
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
        React Frontend        Express API
                                   │
                                   ▼
                              MySQL 8
                                   │
                              Persistent
                               
                               


Eso nos permite utilizar un Dockerfile multi-stage:
Node
  │
  ├── npm ci
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



Docker crea una red interna.
backend
   │
   │ mysql:3306
   ▼
mysql
Mientras desde tu computador:

localhost:4000

entra al backend.

Y:

localhost:3000

entra al frontend.
por lo tanto tendremos:

PC
│
├── localhost:3000 ──────► Frontend
│
└── localhost:4000 ──────► Backend
                              │
                              │ mysql:3306
                              ▼
                            MySQL




✅ Proyecto actual
       ↓
✅ Linux compatible
       ↓
✅ Docker
       ↓
✅ Docker Compose
       ↓
✅ MySQL persistente
       ↓
✅ Frontend + Backend comunicándose
       ↓
✅ Pruebas
       ↓
✅ Deployment


----------------------
estructura final dockerizada

Proyecto-MoveSmart/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── sql/
│   ├── .env
│   ├── Dockerfile          ← crear
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile          ← ya existe, revisar
│   ├── nginx.conf          ← ya existe, revisar
│   └── .dockerignore
│
├── docs/
│
├── docker-compose.yml      ← ÚNICO Compose
├── .env                    ← posiblemente centralizar
└── README.md


                    docker-compose.yml
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      frontend          backend             db
      React/Vite       Node/Express        MySQL
       + Nginx           :4000             :3306
          │                │
          └────── HTTP ────┘
                           │
                           ▼
                         MySQL


----------------
                 docker-compose.yml
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      frontend      backend        db
      React/Vite    Node/Express   MySQL
      Es decir, un único docker-compose.yml en la raíz del proyecto, no un Compose independiente dentro de cada servicio


propuesta arquitectonica
Frontend → 5173 durante desarrollo
Frontend → 80 en producción/Nginx

Backend → 4000

MySQL → 3306

En Docker:
frontend :80
backend  :4000
db       :3306

y desde el navegador:
http://localhost:3000

localhost:3000
      │
      ▼
  frontend
      │
      ▼
localhost:4000
      │
      ▼
   backend
      │
      ▼
   db:3306

esta seria la arquitectura final para la dockerizacion del proyecto:
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
│   ├── .dockerignore
│   └── ...
│
├── docs/
│
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
