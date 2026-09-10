# 📊 Diagramas UML - MOVE SMART

**Product Owner:** Brandon Berrio / Ángel Camilo  
**Developers:** Brandon Berrio / Ángel Camilo  
**Fecha:** Febrero 2026

---

## 📋 Índice
1. [Estructura General](#estructura-general)
2. [Diagrama de Casos de Uso](#diagrama-de-casos-de-uso)
3. [Diagrama de Clases](#diagrama-de-clases)
4. [Roles y Permisos](#roles-y-permisos)

---

## Estructura General

El sistema MOVE SMART está diseñado para tres actores principales, cada uno con responsabilidades y permisos específicos:

```
┌─────────────────────────────────────────────────────────┐
│         SISTEMA MOVE SMART DE MOVILIDAD                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  👥 CIUDADANO              👑 ADMINISTRADOR            │
│  (Solo Lectura)        (CRUD + Análisis y Gestión TI)   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Diagrama de Casos de Uso

### Estructura de Paquetes

```
MOVE SMART
├── 🔐 Autenticación
│   ├── Iniciar Sesión
│   ├── Cambiar Contraseña
│   └── Cerrar Sesión
│
├── 👥 Funcionalidades Ciudadano
│   ├── Visualizar Rutas (solo lectura)
│   ├── Visualizar Paradas
│   ├── Visualizar Zonas Críticas
│   ├── Navegar Mapa Interactivo
│   ├── Filtrar Rutas por Criterios
│   └── Ver Detalles de Ruta
│
├── 👤 Funcionalidades Analista
│   ├── CRUD Rutas
│   │   ├── Crear Nueva Ruta
│   │   ├── Actualizar Ruta
│   │   └── Eliminar Ruta
│   ├── Gestionar Paradas (CRUD)
│   ├── Definir Zonas Críticas
│   ├── Análisis
│   │   ├── Ejecutar Análisis Movilidad
│   │   ├── Comparar Métrica
│   │   └── Ejecutar Simulación
│   ├── Reportes
│   │   ├── Generar Reportes Movilidad
│   │   └── Exportar Datos (PDF/CSV)
│
└── 👑 Funcionalidades Administrador
    ├── Gestionar Usuarios
    │   ├── Crear Usuario
    │   ├── Asignar Roles
    │   ├── Cambiar Estado
    │   └── Eliminar Usuario
    ├── Administración Sistema
    │   ├── Auditar Operaciones
    │   ├── Ver Logs
    │   ├── Configurar Sistema
    │   └── Realizar Backup
    └── Eliminar Información (cascada)
```

### Relaciones de Inclusión

**Ciudadano:**
- `Filtrar Rutas` **include** `Visualizar Rutas`
- `Ver Detalles de Ruta` **include** `Visualizar Rutas`
- `Navegar Mapa` **include** `Visualizar Rutas, Paradas, Zonas`

**Analista:**
- `Gestionar Paradas` **include** `Actualizar Ruta`
- `Comparar Métricas` **include** `Análisis`
- `Exportar Datos` **include** `Generar Reportes`

**Administrador:**
- `Gestionar Usuarios` → includes `Crear, Asignar Roles, Cambiar Estado, Eliminar`
- `Auditoría` → includes `Ver Logs`

---

## Diagrama de Clases

### Jerarquía de Herencia

```
        Usuario (abstracción)
          ↙     ↓     ↘
    Ciudadano  Analista  Administrador
    (Lectura) (CRUD)    (Admin)
```

### Clases Principales

#### 1. **Usuario** (Base)
```
Responsable de autenticación y gestión de sesiones
├── Atributos
│   ├── id, nombre, email, contraseña
│   ├── rol: ENUM(ciudadano, analista, administrador)
│   ├── activo, fechas
├── Métodos
│   ├── login(): boolean
│   ├── logout(): void
│   └── obtenerPerfil(): Usuario
```

#### 2. **Ciudadano** (heredero de Usuario)
```
Usuario público del frontend
├── Métodos
│   ├── visualizarRutas(): List<Ruta>
│   ├── visualizarParadas(): List<Parada>
│   ├── visualizarZonasCriticas(): List<ZonaCritica>
│   └── consultarMapa(): void
├── Restricción: Solo lectura, sin permisos de edición
```

#### 3. **Analista** (heredero de Usuario)
```
Equipo de Secretaría de Movilidad/Operadores
├── Métodos CRUD
│   ├── crearRuta(datos): Ruta
│   ├── actualizarRuta(id, datos): Ruta
│   ├── eliminarRuta(id): boolean
│   ├── gestionarParadas(ruta_id): void
│   ├── definirZonasCriticas(): void
├── Métodos Análisis
│   ├── ejecutarAnalisis(): Analisis
│   ├── compararMetricas(ruta1, ruta2): Comparacion
│   ├── generarSimulacion(): Simulacion
```

#### 4. **Administrador** (heredero de Usuario)
```
Equipo Técnico / Área TI
├── Métodos
│   ├── gestionarUsuarios(): List<Usuario>
│   ├── asignarRoles(usuario_id, rol): boolean
│   ├── cambiarEstadoUsuario(usuario_id, estado): boolean
│   ├── eliminarDatos(tabla, id): boolean ⚠️
│   ├── auditarOperaciones(): List<AuditoriaLog>
│   ├── configurarSistema(): void
│   └── backupBaseDatos(): void
├── Restricción: NO toma decisiones de movilidad
```

### Entidades del Dominio

#### **Ruta**
```
Representa una ruta de transporte
├── Atributos
│   ├── id, nombre, código
│   ├── origen, destino
│   ├── distancia_km, tiempo_estimado_min
│   ├── estado: ENUM(actual, optimizada)
│   ├── color_hex (visualización)
├── Métodos
│   ├── calcularDistancia(): decimal
│   ├── calcularTiempo(): int
│   └── obtenerParadas(): List<Parada>
├── Relaciones
│   ├── 1 Ruta ↔ * Paradas
│   ├── 1 Ruta ↔ * Vehículos
│   └── 1 Ruta ↔ * Métricas
```

#### **Parada**
```
Parada individual dentro de una ruta
├── Atributos
│   ├── id, ruta_id
│   ├── nombre, código
│   ├── latitud, longitud
│   ├── orden (secuencia en ruta)
│   ├── capacidad_usuarios, tiempo_espera
├── Métodos
│   ├── obtenerCoordenadas(): {lat, lon}
│   └── calcularOcupacion(): decimal
├── Constraint
│   └── UNIQUE(ruta_id, orden)
```

#### **ZonaCrítica**
```
Puntos de congestión en la ciudad
├── Atributos
│   ├── id, nombre, descripción
│   ├── latitud, longitud
│   ├── nivel_congestion: ENUM(bajo, medio, alto, crítico)
│   ├── color_hex (mapeo: bajo=#33ff57, medio=#ff7f00, alto=#ff3333, crítico=#cc0000)
├── Métodos
│   ├── obtenerNivel(): string
│   ├── obtenerColor(): string
│   └── actualizarCongestion(): void
```

#### **Vehículo**
```
Buses / Transporte asignado a rutas
├── Atributos
│   ├── id, ruta_id, placa
│   ├── modelo
│   ├── capacidad_asientos, capacidad_parados
│   ├── estado: ENUM(disponible, mantenimiento, fuera_servicio)
├── Métodos
│   ├── obtenerCapacidadTotal(): int
│   └── cambiarEstado(nuevo_estado): void
```

#### **Métrica**
```
Datos de rendimiento de rutas
├── Atributos
│   ├── id, ruta_id, fecha
│   ├── usuarios_totales, ocupación
│   ├── tiempo_promedio, combustible_consumido
│   ├── emiciones
├── Métodos
│   ├── calcularAhorro(): decimal
│   ├── calcularEficiencia(): decimal
│   └── generarResumen(): string
```



#### **Reporte**
```
Reportes generados del sistema
├── Atributos
│   ├── id, usuario_id
│   ├── tipo: ENUM(diario, semanal, mensual, customizado)
│   ├── periodo_desde, periodo_hasta
│   ├── contenido
├── Métodos
│   ├── exportarPDF(): File
│   ├── exportarCSV(): File
│   └── enviarEmail(destinatario): boolean
```

## Roles y Permisos

### 👥 **CIUDADANO** (Usuario Público)

| Funcionalidad | Puede Hacer | Restricción |
|---|---|---|
| Visualizar Rutas | ✅ Sí | Solo lectura |
| Visualizar Paradas | ✅ Sí | Solo lectura |
| Visualizar Zonas Críticas | ✅ Sí | Solo lectura |
| Navegar Mapa | ✅ Sí | Interactivo |
| Crear/Editar Rutas | ❌ No | - |
| Ejecutar Análisis | ❌ No | - |
| Crear Usuarios | ❌ No | - |
| **Ambiente** | Frontend Público (Web/App) | |
| **Quién** | Habitante de Manizales, usuario transporte | |

---

### 👤 **ANALISTA** (Secretaría de Movilidad)

| Funcionalidad | Puede Hacer | Notas |
|---|---|---|
| Crear Ruta | ✅ Sí | Completa |
| Actualizar Ruta | ✅ Sí | Incluyendo paradas |
| Eliminar Ruta | ✅ Sí | Validación cascada |
| Gestionar Paradas | ✅ Sí | CRUD completo |
| Definir Zonas Críticas | ✅ Sí | Con color_hex |
| Ejecutar Análisis | ✅ Sí | Movilidad |
| Ejecutar Simulaciones | ✅ Sí | Escenarios académicos |
| Comparar Métricas | ✅ Sí | Ruta1 vs Ruta2 |
| Generar Reportes | ✅ Sí | PDF/CSV |
| Gestionar Usuarios | ❌ No | Solo admin |
| **Ambiente** | Panel Interno React | Dashboard analítica |
| **Quién** | Secretaría Movilidad, operadores, planeadores | |

---

### 👑 **ADMINISTRADOR** (Equipo TI)

| Funcionalidad | Puede Hacer | Notas |
|---|---|---|
| Crear Usuario | ✅ Sí | Con rol asignado |
| Asignar Roles | ✅ Sí | Ciudadano/Analista/Admin |
| Cambiar Estado Usuario | ✅ Sí | Activo/Inactivo |
| Eliminar Usuario | ✅ Sí | Cascada de datos |
| Auditar Operaciones | ✅ Sí | Logs completos |
| Ver Logs del Sistema | ✅ Sí | Por fecha/usuario |
| Configurar Sistema | ✅ Sí | Variables globales |
| Realizar Backup | ✅ Sí | BD completa |
| Eliminar Datos | ✅ Sí | ⚠️ Verificación requerida |
| Decidir sobre Rutas | ❌ No | Solo TI |
| Crear Rutas | ❌ No | Responsabilidad Analista |
| **Ambiente** | Backend / Panel Admin | |
| **Quién** | Equipo técnico, desarrolladores | |

---

## Mapeo de Colores - Zonas Críticas

| Nivel | Color Hex | Significado |
|---|---|---|
| 🟢 Bajo | `#33ff57` | Tráfico normal, sin congestión |
| 🟠 Medio | `#ff7f00` | Congestión moderada, requiere atención |
| 🔴 Alto | `#ff3333` | Congestión severa, intervención recomendada |
| 🩸 Crítico | `#cc0000` | Tráfico colapsado, acción inmediata |

---

## Códigos y Estados

### Estados de Vehículo
```sql
-- Valores posibles en ENUM('disponible', 'mantenimiento', 'fuera_servicio')
'disponible'      → Listo para operar
'mantenimiento'   → En revisión técnica
'fuera_servicio'  → No disponible
```

---

## Guía de Exportación

Para exportar los diagramas UML a imágenes:

```bash
# Opción 1: Online (PlantUML Server)
# Copiar contenido de .yml y pegar en:
# https://www.plantuml.com/plantuml/uml/

# Opción 2: CLI Local (requiere instalación)
plantuml diagrama-clases.yml -o output/
plantuml diagrama-casos-uso.yml -o output/
```

---

## Notas Finales

- ✅ **Ciudadano**: Acceso limitado a Frontend Público
- ✅ **Analista**: Panel Administrativo React con CRUD y análisis
- ✅ **Administrador**: Backend - Gestión de TI y auditoría
- ⚠️ **Separación clara**: Cada rol tiene responsabilidades específicas sin sobreposición
- 📊 **Escalabilidad**: Arquitectura permite agregar nuevos roles en el futuro

---

**Última actualización:** Febrero 9, 2026  
**Versión:** 2.0 (Optimizada con roles definidos)

