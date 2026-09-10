# 📐 ARQUITECTURA DE BASE DE DATOS: Move Smart

## 📋 **Índice**
1. [Resumen ejecutivo](#resumen)
2. [Entidades principales](#entidades)
3. [Relaciones y cardinalidades](#relaciones)
4. [Mapeo: db.json → MySQL](#mapeo)
5. [Vistas útiles](#vistas)
6. [Índices y optimización](#índices)

---

## 📊 **Resumen Ejecutivo** {#resumen}

La base de datos **Move Smart** está diseñada para:

- **Gestionar usuarios** con 3 roles diferentes ( Administrador, Ciudadano)
- **Almacenar rutas** de transporte público con paradas y vehículos
- **Calcular métricas** de eficiencia, ocupación y costos
- **Generar reportes** y aprobar cambios propuestos
- **Auditar cambios** para trazabilidad completa

**Total de tablas:** 9  
**Total de vistas:** 2  
**Relaciones:** 12 (con integridad referencial)  
**Índices optimizados:** 15+  

---

## 🗂️ **ENTIDADES PRINCIPALES** {#entidades}

### 1. **USUARIOS** (Base de todo)

```sql
tabla: usuarios
├── id (INT, PRIMARY KEY)
├── nombre (VARCHAR 100)
├── email (VARCHAR 100, UNIQUE)
├── password (VARCHAR 255, hash SHA2)
├── rol (ENUM: administrador, ciudadano)
├── estado (ENUM: activo, inactivo)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Registros esperados: 2-10
Índices: email, rol
```

**Relaciones:**
- Administrador → aprueba Aprobaciones, genera Reportes y ejecuta Simulaciones
- Ciudadano → consulta Rutas

**Datos de ejemplo:**
```json
{
  "id": 1,
  "nombre": "Carlos García",
  "email": "carlos.administrador@movesmart.local",
  "rol": "administrador",
  "estado": "activo"
}
```

---

### 2. **RUTAS** (Centro del sistema)

```sql
tabla: rutas
├── id (INT, PRIMARY KEY)
├── nombre (VARCHAR 100) [Ej: "Ruta 1", "Ruta Centro-Comercial"]
├── descripcion (TEXT)
├── origen (VARCHAR 100) [Ej: "Centro Histórico"]
├── destino (VARCHAR 100) [Ej: "Centro Comercial Fundadores"]
├── distancia_km (DECIMAL 10,2)
├── tiempo_estimado_minutos (INT)
├── color (VARCHAR 7) [HEX color para mapas]
├── estado (ENUM: actual, propuesta, inactiva)
├── pasajeros_diarios (INT)
├── calificacion_eficiencia (INT 0-100)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Registros esperados: 5-50
Índices: estado, origen-destino, eficiencia
```

**Mapeo desde db.json:**
```
db.json.routes[].name              → rutas.nombre
db.json.routes[].description       → rutas.descripcion
db.json.routes[].origin            → rutas.origen
db.json.routes[].destination       → rutas.destino
db.json.routes[].distance_km       → rutas.distancia_km
db.json.routes[].estimated_time_minutes → rutas.tiempo_estimado_minutos
db.json.routes[].daily_passengers  → rutas.pasajeros_diarios
db.json.routes[].efficiency_score  → rutas.calificacion_eficiencia
```

**Datos de ejemplo:**
```json
{
  "id": 1,
  "nombre": "Ruta 1",
  "origen": "Centro Histórico",
  "destino": "Centro Comercial Fundadores",
  "distancia_km": 4.5,
  "tiempo_estimado_minutos": 25,
  "estado": "actual",
  "pasajeros_diarios": 450,
  "calificacion_eficiencia": 85
}
```

---

### 3. **PARADAS** (Detalles de cada ruta)

```sql
tabla: paradas
├── id (INT, PRIMARY KEY)
├── ruta_id (INT, FOREIGN KEY → rutas.id)
├── nombre (VARCHAR 100)
├── latitud (DECIMAL 10,8) [Coordenadas GPS]
├── longitud (DECIMAL 11,8)
├── orden (INT) [Secuencia en la ruta]
├── capacidad (INT) [Personas que caben]
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Registros esperados: 20-100
Índices: ruta_id, orden, ubicación
```

**Relación:**
- 1 RUTA → * PARADAS (Una ruta tiene muchas paradas)

**Mapeo desde db.json:**
```
db.json.stops[].name               → paradas.nombre
db.json.stops[].lat                → paradas.latitud
db.json.stops[].lon                → paradas.longitud
db.json.stops[].capacity           → paradas.capacidad
db.json.stops[].daily_users        → paradas.usuarios_diarios
db.json.stops[].route_ids[0]       → paradas.ruta_id
```

**Datos de ejemplo:**
```json
{
  "id": 1,
  "ruta_id": 1,
  "nombre": "Centro Histórico",
  "latitud": 5.0722,
  "longitud": -75.5115,
  "orden": 1,
  "capacidad": 50,
  "usuarios_diarios": 320
}
```

---

---

### 4. **MÉTRICAS** (Datos simulados)

```sql
tabla: metricas
├── id (INT, PRIMARY KEY)
├── ruta_id (INT, FOREIGN KEY → rutas.id)
├── tiempo_decimal (DECIMAL 10,2) [Minutos]
├── distancia_decimal (DECIMAL 10,2) [Kilómetros]
├── costo_decimal (DECIMAL 10,2) [Unidades monetarias]
├── ocupacion (INT) [Porcentaje 0-100]
├── ahorros_estimados (DECIMAL 10,2) [Comparativo]
└── created_at (TIMESTAMP)

Registros: 1-5 por ruta
Índices: ruta_id, created_at
```

**Uso:**
- Almacena resultados de simulaciones
- Compara métricas actuales vs propuestas
- Calcula potenciales ahorros

**Relaciones:**
- 1 USUARIO (Administrador) → * SIMULACIONES
- 1 RUTA → * SIMULACIONES


---

## 🔗 **RELACIONES Y CARDINALIDADES** {#relaciones}

```
usuarios (1) ─→ (*) simulaciones
              ├→ (*) reportes

rutas (1) ─→ (*) paradas

```

---

## 🔄 **MAPEO: db.json → MySQL** {#mapeo}

| db.json | MySQL | Tipo | Notas |
|---------|-------|------|-------|
| routes | rutas | 1:1 | Datos directos |
| stops | paradas | 1:1 | Incluye ruta_id desde route_ids[0] |
| (users) | usuarios | 1:1| Nuevos registros |

---

## 👁️ **VISTAS ÚTILES** {#vistas}

### Vista 1: Rutas Completas

```sql
CREATE VIEW vista_rutas_completas AS
SELECT 
    r.id,
    r.nombre,
    r.origen,
    r.destino,
    r.distancia_km,
    COUNT(DISTINCT p.id) as total_paradas,
    r.calificacion_eficiencia
FROM rutas r
LEFT JOIN paradas p ON r.id = p.ruta_id
GROUP BY r.id;
```

**Uso:**
```sql
SELECT * FROM vista_rutas_completas WHERE calificacion_eficiencia > 80;
```


---

## 🎯 **PRÓXIMOS PASOS**

1. ✅ Entender la estructura (¡ya lo hiciste!)
2. ✅ Crear las tablas con `schema.sql`
3. ✅ Insertar datos iniciales con `datos-iniciales.sql`
4. ✅ Ejecutar migración: `migrate-to-mysql.js`
5. ✅ Cambiar `.env` a `USE_LOCAL_DB=false`
6. ✅ Probar endpoints

