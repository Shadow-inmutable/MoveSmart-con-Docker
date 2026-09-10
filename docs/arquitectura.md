# Arquitectura del sistema

## Enfoque
El sistema utiliza una arquitectura monolítica modular basada en el patrón MVC, con posibilidad de migración futura a microservicios.

## Arbol de directorios
/Proyecto-MoveSmart
│
├── /backend
│   ├── /config          # Conexión DB
│   ├── /controllers     # Lógica de negocio (Cálculos, controladores)
│   ├── /Middlewares     # Consultas SQL
│   ├── /routes          # Endpoints API
│   ├── /sql             # esquema base de datos
│   ├── .env             # Datos sensibles (Ignorado por Git)
│   ├── index.js         # Inicio del servidor 
│   └── /migrate-to-mysql.js # Conecta a MySQL y Migra datos de rutas, zonas y paradas
│
├── /frontend
│   ├── /public          # Imágenes y assets
│   ├── /src
│   │   │ 
│   │   ├── api/              # Llamadas al backend (axios/fetch)
│   │   │    ├──api.js     
│   │   ├── components/ # UI (Interfaz de Usuario) # Navbar, Sidebar, Cards, Charts
│   │   │    ├── Navbar.jsx
│   │   │    ├── Sidebar.jsx             # Menú izquierdo (rutas + zonas críticas)
│   │   │    ├── MapaLeaflet.jsx         # Mapa 
│   │   │    ├── ZonaCriticaCard.jsx     # Tarjeta de zona crítica
│   │   │    ├── GraficaComparacion.jsx  # Gráfica con Recharts
│   │   │    ├── GraficaDistancia.jsx    # Gráfica con Recharts
│   │   │    ├── GraficaEficiencia.jsx   # Gráfica con Recharts
│   │   │    ├── MetricasOptimizacion.jsx # Calculo para visualizar Metricas optimizacion + Filtro x ruta
│   │   │    ├── ParadasGestor.jsx       # componente para visualizar paradas registradas desde la BD"
│   │   │    ├── ParadasPublicas.jsx     # información básica de paradas para usuarios ciudadanos
│   │   │    └──MapaLeaflet.jsx          # mapa reutilzable para interfaz gestores/ciudadanos
│   │   ├── pages/                       # Login, Dashboard, Simulador, Reportes
│   │   │    ├── Home.jsx                # Bienvenida ciudadano
│   │   │    ├── Login.jsx
│   │   │    ├── Dashboard.jsx      # Panel gestor/admin      │
│   │   │    ├── Mapa.jsx           # Leaflet logic
│   │   │    ├── ParadasForms.jsx   # CRUD de paradas conectado a API
│   │   │    ├── RutasForms.jsx     # CRUD Rutas conectado a API
│   │   │    └── ZonasForms.jsx     # CRUD completo de zonas críticas conectado a la API 
│   ├── /services    # Conexión con Backend (Fetch/Axios)
│   ├── /hooks       # Lógica de estado compartida
│   ├── App.js       # Componente raíz
│   ├── App.jsx/          
│   ├── main.jsx/            
│   ├── index.html/        
│   ├── eslint.config.js/           # Imágenes / íconos 
│   └──Readme.md
│
├── docs/
│   ├── mockups/
│   │  ├── mockup_interfaz1, 2 y 3
│   ├── introduccion.md  / problema-solucion.md  / objetivos-alcance.md 
│   ├── arquitectura.md
│   ├── arquitectura_base_de_datos.md
│   ├── diagramas-casos-uso.yml
│   ├── diagramas-clases.yml
│   ├── readme_diagramas.md
│   ├── readme_migracion.md
│   ├── guia_migracion.md
│   ├── backlog.md  / scrum.md 
└── README.md

## Backend
- Entonrno de ejecucion Node.js
- Express
- API REST

## Frontend
- React JS (Web)
- React Native (futuro)
- Libreria de mapa leafflet.js

## Control de versionamiento
- Git/Gitub

## Base de datos
- MySQL

## Comunicación
El frontend consume la API REST para obtener datos simulados y visualizarlos mediante gráficos y mapas conceptuales.

## Estandares
- clean code
- SOLID

## Requerimientos
- Visualización de Red Vial
- Gestión de Paradas
- Simulación de Optimización
- Panel de Métricas:
- Identificación de Zonas Críticas
- Gestión de Usuarios

Obejetivo real de uso de componentes:

No es obligatorio tenerlos… PERO sí es una práctica profesional.

Porque:

Evita tener un Dashboard.jsx gigante

Permite reutilizar piezas

Facilita conectar datos reales del backend

Hace el código mantenible.
