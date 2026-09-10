# Arquitectura de MOVE SMART

## 1. Introducción

MOVE SMART es una aplicación web académica orientada al análisis y optimización simulada de rutas de transporte público urbano.

La arquitectura separa la presentación, la lógica de aplicación y la persistencia de datos.

El proyecto utiliza Docker y Docker Compose para proporcionar un entorno reproducible y facilitar su ejecución en diferentes sistemas operativos.

---

# 2. Objetivo arquitectónico

La arquitectura tiene como objetivos:

- Separar frontend, backend y base de datos.
- Facilitar la containerización del proyecto.
- Mantener persistencia de los datos.
- Permitir comunicación mediante una red Docker.
- Declarar la inicialización de la base de datos mediante scripts SQL.
- Facilitar la reproducción del entorno.
- Preparar el proyecto para una futura evolución hacia producción.

---

# 3. Arquitectura actual

La arquitectura actual está compuesta por:

- Frontend.
- Backend.
- MySQL.
- phpMyAdmin como herramienta auxiliar de administración.

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

phpMyAdmin no participa en la lógica de negocio. Su función es proporcionar una interfaz visual para la administración y verificación de MySQL.

---

# 4. Componentes

## 4.1 Frontend

El frontend utiliza:

- React.
- Vite.
- Axios.
- Chart.js.
- Recharts.
- Leaflet.

Nginx se utiliza como servidor de archivos estáticos.

El contenedor utiliza:

```text
80
```

y actualmente se publica en el host mediante:

```text
3000
```

---

## 4.2 Backend

El backend utiliza:

- Node.js.
- Express.
- JavaScript.
- mysql2.
- JWT.
- bcryptjs.

El backend proporciona la API REST y contiene la lógica relacionada con:

- Usuarios.
- Autenticación.
- Rutas.
- Paradas.
- Zonas críticas.

El servicio escucha en:

```text
4000
```

---

## 4.3 MySQL

La persistencia utiliza:

```text
MySQL 8.4
```

La base de datos es:

```text
move_smart_db
```

Dentro de Docker, el backend utiliza:

```text
mysql:3306
```

---

## 4.4 phpMyAdmin

phpMyAdmin es un servicio auxiliar destinado a la administración visual de MySQL.

Utiliza:

```text
mysql:3306
```

para comunicarse con la base de datos.

Se publica actualmente en:

```text
http://localhost:8081
```

---

# 5. Docker Compose

El proyecto utiliza un único archivo:

```text
docker-compose.yml
```

ubicado en la raíz.

La estructura es:

```text
Proyecto-MoveSmart/
│
├── backend/
│   └── Dockerfile
│
├── frontend/
│   └── Dockerfile
│
├── docker-compose.yml
│
└── ...
```

Los servicios definidos actualmente son:

```text
frontend
backend
mysql
phpmyadmin
```

---

# 6. Red Docker

Los servicios están conectados mediante una red Docker:

```text
movesmart_network
```

La comunicación interna utiliza los nombres de los servicios.

Por ejemplo:

```text
backend → mysql:3306
```

y:

```text
phpmyadmin → mysql:3306
```

Dentro de Docker no debe utilizarse `localhost` para acceder a otro contenedor.

---

# 7. Comunicación entre servicios

El flujo principal de la aplicación es:

```text
NAVEGADOR
    │
    │ localhost:3000
    ▼
FRONTEND
React + Nginx
    │
    │ HTTP
    ▼
BACKEND
Node + Express
    │
    │ mysql:3306
    ▼
MYSQL
```

El flujo administrativo es:

```text
NAVEGADOR
    │
    │ localhost:8081
    ▼
PHPMYADMIN
    │
    │ mysql:3306
    ▼
MYSQL
```

---

# 8. Puertos

La configuración actual utiliza:

| Servicio | Puerto interno | Puerto host |
|---|---:|---:|
| Frontend / Nginx | 80 | 3000 |
| Backend / Express | 4000 | 4000 |
| MySQL | 3306 | 3306 |
| phpMyAdmin | 80 | 8081 |

El puerto `3306` se encuentra actualmente publicado para facilitar pruebas y administración durante el desarrollo académico.

Para producción se recomienda eliminar su publicación al host y mantener MySQL únicamente dentro de la red Docker.

---

# 9. Persistencia

MySQL utiliza el volumen:

```text
mysql_data
```

montado en:

```text
/var/lib/mysql
```

Flujo:

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

---

# 10. Comportamiento del volumen

Al ejecutar:

```bash
docker compose down
```

se eliminan los contenedores, pero el volumen permanece.

```text
Contenedores → eliminados
Volumen      → conservado
Datos        → conservados
```

Al ejecutar:

```bash
docker compose down -v
```

también se eliminan los volúmenes:

```text
Contenedores → eliminados
Volúmenes    → eliminados
Datos        → eliminados
```

Esto provoca una nueva inicialización de MySQL al volver a crear los servicios.

---

# 11. Inicialización de MySQL

La estructura de la base de datos está declarada en:

```text
backend/sql/schema.sql
```

Los datos iniciales están declarados en:

```text
backend/sql/seed.sql
```

Docker monta estos archivos en:

```text
/docker-entrypoint-initdb.d/
```

Durante la inicialización del volumen, MySQL ejecuta los scripts.

De esta forma, el estado inicial de la base de datos está declarado dentro del proyecto y no depende de una creación manual.

---

# 12. Healthchecks

MySQL dispone de un `healthcheck` para verificar que el servicio esté disponible.

El backend depende de que MySQL se encuentre disponible antes de iniciar.

El backend también proporciona:

```http
GET /health
```

Respuesta:

```json
{
  "status": "ok",
  "service": "movesmart-backend"
}
```

---

# 13. Construcción de imágenes

Frontend y backend disponen de Dockerfiles independientes:

```text
frontend/Dockerfile
backend/Dockerfile
```

Esto permite construir cada componente mediante Docker.

Ejemplo:

```bash
docker compose build
```

---

# 14. Frontend — Multi-stage build

El frontend utiliza una construcción multi-stage.

```text
┌──────────────────────────┐
│       BUILD STAGE        │
│                          │
│        Node.js           │
│                          │
│ npm ci                   │
│ npm run build            │
│                          │
│        ↓                 │
│       dist/              │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      RUNTIME STAGE       │
│                          │
│        Nginx             │
│                          │
│      /usr/share/         │
│        nginx/html        │
└──────────────────────────┘
```

La etapa final solamente necesita los archivos generados para servir la aplicación.

---

# 15. Backend — Construcción

El backend utiliza actualmente:

```text
node:22-alpine
```

como imagen base.

La imagen contiene el entorno necesario para ejecutar Node.js y las dependencias del backend.

La aplicación se ejecuta mediante:

```text
node index.js
```

---

# 16. Justificación de imágenes base

## Node.js Alpine

Se utiliza:

```text
node:22-alpine
```

porque proporciona una imagen basada en Alpine Linux con un tamaño reducido frente a imágenes más completas.

Es adecuada para servicios Node.js que requieren un runtime ligero.

## Nginx Alpine

El frontend utiliza:

```text
nginx:alpine
```

porque Nginx es adecuado para servir los archivos estáticos generados por Vite y la variante Alpine reduce el tamaño de la imagen.

## MySQL

Se utiliza:

```text
mysql:8.4
```

en lugar de:

```text
mysql:latest
```

para mantener una versión explícita y reproducible.

---

# 17. .dockerignore

Frontend y backend deben contar con su propio:

```text
.dockerignore
```

Como mínimo deben excluir:

```text
node_modules/
.env
.git/
```

Esto evita enviar dependencias locales, secretos y archivos del repositorio al contexto de construcción.

---

# 18. Reproducibilidad

La configuración del entorno se encuentra declarada mediante:

```text
docker-compose.yml
Dockerfile
.dockerignore
.env.example
schema.sql
seed.sql
```

La ejecución principal puede realizarse mediante:

```bash
docker compose up -d --build
```

Esto permite reconstruir el entorno sin depender de instalaciones manuales de Node.js o MySQL en el equipo.

---

# 19. Verificación

Estado de los servicios:

```bash
docker compose ps
```

Logs:

```bash
docker compose logs
```

Logs del backend:

```bash
docker compose logs backend
```

Logs de MySQL:

```bash
docker compose logs mysql
```

---

# 20. Arquitectura objetivo para producción

Para producción se recomienda mantener MySQL fuera de la exposición directa al host.

La arquitectura sería:

```text
HOST
 │
 ├── :3000 → FRONTEND
 │
 ├── :4000 → BACKEND
 │
 └── :8081 → PHPMYADMIN
                    │
                    ▼
                  MYSQL
                 :3306
```

MySQL permanecería accesible únicamente desde la red interna:

```text
backend → mysql:3306
phpmyadmin → mysql:3306
```

---

# 21. Almacenamiento de objetos

La arquitectura actual no implementa todavía almacenamiento mediante S3 o Floci.

Como evolución futura, el almacenamiento de archivos podría separarse de MySQL:

```text
Aplicación
    │
    ├── Metadatos ──────► MySQL
    │
    └── Archivos ───────► S3 / Floci
```

MySQL almacenaría los metadatos del archivo:

- Nombre.
- Tamaño.
- Fecha.
- Identificador.
- Referencia al objeto.

El archivo propiamente dicho permanecería en el almacenamiento de objetos.

---

# 22. Camino a producción

La evolución prevista puede representarse como:

```text
                    INTERNET
                        │
                        ▼
                Reverse Proxy / HTTPS
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
```

Las principales mejoras para producción serían:

- HTTPS.
- MySQL en red privada.
- Gestión externa de secretos.
- Usuarios no privilegiados en contenedores.
- Backups automatizados.
- Almacenamiento de objetos.
- Monitoreo.
- Logs centralizados.
- Restricción de phpMyAdmin.

# 23. Arquitectura de la séguridad de los usuarios y roles

                         MOVE SMART
                              │
              ┌───────────────┴───────────────┐
              │                               │
         INFORMACIÓN                      GESTIÓN
          PÚBLICA                       AUTENTICADA
              │                               │
       ┌──────┼──────┐              ┌─────────┼─────────┐
       │      │      │              │                   │
     rutas  zonas  paradas       gestor               admin
       │      │      │              │                   │
       └──────┴──────┘              ├─ rutas             ├─ rutas
              │                     ├─ zonas             ├─ zonas
              │                     └─ paradas            ├─ paradas
              │                                           │
       Ciudadano puede                                  usuarios
       CONSULTAR                                        │
                                                        └─ solo admin

**Así tenemos una arquitecura mas limpia.**

rutasRoutes.js
      │
      ├── verificarToken
      │
      └── requireRole('gestor', 'admin')
                  │
                  ▼
        rutasController.js
                  │
                  └── ejecuta