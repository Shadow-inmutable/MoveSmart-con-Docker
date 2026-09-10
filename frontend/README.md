# MOVE SMART — Frontend

Frontend de MOVE SMART desarrollado con React y Vite.

Su responsabilidad es proporcionar la interfaz gráfica mediante la cual los usuarios interactúan con las funcionalidades del sistema.

---

# 🧩 Tecnologías

- React
- Vite
- Axios
- Chart.js
- Recharts
- Leaflet
- Nginx
- Docker

---

# 🏗️ Estructura

```text
frontend/
│
├── public/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── package.json
├── package-lock.json
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── .env.example
└── README.md
```

---

# 🖥️ Funcionalidades

El frontend contiene las interfaces relacionadas con:

- Página principal.
- Inicio de sesión.
- Registro.
- Mapa.
- Dashboard.
- Gestión de rutas.
- Gestión de paradas.
- Gestión de zonas críticas.
- Administración de usuarios.

---

# 🔌 Comunicación con el backend

El frontend utiliza Axios para realizar las peticiones a la API REST.

El flujo es:

```text
Navegador
    │
    ▼
React
    │
    ▼
api.js
    │
    ▼
Axios
    │
    ▼
Backend
```

La configuración utiliza:

```env
VITE_API_URL=http://localhost:4000
```

La API se encuentra bajo:

```text
http://localhost:4000/api
```

---

# 🔐 Autenticación

Después del inicio de sesión, el frontend recibe un JWT.

El token se almacena en el navegador y se incluye en las peticiones protegidas mediante:

```http
Authorization: Bearer <token>
```

El frontend también utiliza el rol del usuario para controlar el acceso a las rutas protegidas.

---

# 👥 Control de acceso

Las rutas protegidas utilizan el componente:

```text
ProtectedRoute
```

La distribución actual es:

```text
admin
 ├── Dashboard
 ├── Rutas
 ├── Paradas
 ├── Zonas
 └── Usuarios

gestor
 ├── Dashboard
 ├── Rutas
 ├── Paradas
 └── Zonas

ciudadano
 └── Funciones de consulta
```

---

# 🗺️ Visualización

El frontend utiliza:

- Leaflet para mapas.
- Chart.js.
- Recharts.

Estas herramientas permiten representar información relacionada con rutas, paradas, zonas críticas y escenarios de movilidad.

---

# 🐳 Docker

El frontend utiliza una construcción multi-stage.

## Etapa de construcción

```text
Node.js
   │
   ├── npm ci
   ├── copia del código
   └── npm run build
           │
           ▼
          dist
```

## Etapa de ejecución

```text
dist
 │
 ▼
Nginx
 │
 ▼
Aplicación React
```

La etapa final utiliza Nginx para servir los archivos estáticos generados por Vite.

---

# 🌐 Puertos

Puerto interno:

```text
80
```

Puerto publicado en el host:

```text
3000
```

Acceso:

```text
http://localhost:3000
```

---

# ⚙️ Variables de entorno

La plantilla se encuentra en:

```text
frontend/.env.example
```

Variable principal:

```env
VITE_API_URL=http://localhost:4000
```

La variable es utilizada por Vite durante la construcción de la aplicación.

---

# 🌐 Nginx

Nginx sirve la aplicación compilada por Vite.

Los archivos generados se encuentran en:

```text
/usr/share/nginx/html
```

La configuración se encuentra en:

```text
frontend/nginx.conf
```

Nginx también permite el funcionamiento de las rutas de React mediante el fallback hacia:

```text
/index.html
```

---

# 🚀 Docker

Construir:

```bash
docker compose build frontend
```

Iniciar:

```bash
docker compose up -d frontend
```

Ver estado:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs frontend
```

---

# 🔎 Comprobación

Abrir en el navegador:

```text
http://localhost:3000
```

El frontend debe cargar la aplicación y comunicarse con:

```text
http://localhost:4000/api
```