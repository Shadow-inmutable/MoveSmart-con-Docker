# 🗄️ GUÍA DE MIGRACIÓN A MYSQL CON XAMPP

> **✅ Guía paso a paso para migrar de db.json a MySQL usando XAMPP**

---

## 📋 **Contenido**

1. [Requisitos](#requisitos)
2. [Paso 1: Iniciar XAMPP](#paso-1-iniciar-xampp)
3. [Paso 2: Crear Base de Datos](#paso-2-crear-base-de-datos)
4. [Paso 3: Ejecutar Schema](#paso-3-ejecutar-schema)
5. [Paso 4: Ejecutar Datos Iniciales](#paso-4-ejecutar-datos-iniciales)
6. [Paso 5: Correr Script de Migración](#paso-5-correr-script-de-migración)
7. [Paso 6: Actualizar Configuración](#paso-6-actualizar-configuración)
8. [Paso 7: Verificar Migración](#paso-7-verificar-migración)
9. [Solución de Problemas](#solución-de-problemas)
10. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## ⚙️ **Requisitos**

Asegúrate de tener:

- ✅ XAMPP instalado con MySQL corriendo
- ✅ Node.js v16+ instalado
- ✅ Backend actualizado con los archivos:
  - `backend/sql/schema.sql`
  - `backend/sql/datos-iniciales.sql`
  - `backend/migrate-to-mysql.js`
- ✅ `backend/db.json` con datos actuales

---

## **PASO 1: Iniciar XAMPP**

### 1️⃣ Abre XAMPP Control Panel

```
Windows: C:\xampp\xampp-control.exe
Mac: /Applications/XAMPP/manage-servers
Linux: /opt/lampp/manager-linux-x64.run
```

### 2️⃣ Inicia MySQL

Haz click en **"Start"** para MySQL:

```
✅ MySQL: Running
   PID: 12345
```

Si ves algún error, revisa la sección "Solución de Problemas".

### 3️⃣ Verifica que funciona (Opcional)

Abre en el navegador:

```
http://localhost/phpmyadmin
```

Deberías ver la interfaz azul de phpMyAdmin.

---

## **PASO 2: Crear Base de Datos**

### **Opción A: Con phpMyAdmin (Recomendado - Visual)**

#### En el navegador: `http://localhost/phpmyadmin`

1. Click en **"Especial"** o **"Databases"** (arriba a la izquierda)
2. Scroll hacia abajo hasta **"Create new database"**
3. Nombre de BD: `move_smart_db`
4. Collation: `utf8mb4_unicode_ci`
5. Click **"Create"**

✅ BD creada correctamente

---

### **Opción B: Con Línea de Comandos (Más rápido)**

Abre **PowerShell** y ejecuta:

```powershell
# Navega a la carpeta de MySQL en XAMPP
cd "C:\xampp\mysql\bin"

# Crea la base de datos
mysql -u root -e "CREATE DATABASE move_smart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Verifica que se creó
mysql -u root -e "SHOW DATABASES;"
```

Deberías ver:
```
move_smart_db
```

---

## **PASO 3: Ejecutar Schema**

El **schema.sql** crea 9 tablas + 2 vistas.

### **Opción A: Con phpMyAdmin**

En phpMyAdmin:

1. Click en **"move_smart_db"** (la BD que acabas de crear)
2. Top del navegador → **"Importar"** (o "Import")
3. Click en **"Seleccionar archivo"** (Choose File)
4. Busca y selecciona: `backend/sql/schema.sql`
5. Scroll a abajo → Click **"Ejecutar"** (Execute/Go)

Espera a que termine...

✅ Deberías ver mensaje de éxito (verde)

---

### **Opción B: Con Línea de Comandos**

```powershell
# Navega a proyecto
cd "c:\Users\thesh\Documents\SHADOWS.DOCS\UN.RENIMNTON\VII Semestre\LINEA_ENFASIS_1\proyecto-movesmart\backend"

# Ejecuta schema
mysql -u root move_smart_db < sql/schema.sql
```

Espera a que termine (sin mensajes = éxito).

---

### Verificar Tablas Creadas

En phpMyAdmin, click en **"move_smart_db"**:

Deberías ver en la lista izquierda:

```
✅ usuarios
✅ rutas
✅ paradas
✅ metricas
✅ reportes


💾 + 2 vistas
```

---

## **PASO 4: Ejecutar Datos Iniciales**

El **datos-iniciales.sql** inserta:
- 6 usuarios de ejemplo
- 5 rutas (Manizales)
- 40 paradas
- 9 vehículos
- Métricas, reportes

### **Opción A: Con phpMyAdmin**

En phpMyAdmin, en **"move_smart_db"**:

1. Top → **"Importar"**
2. Selecciona: `backend/sql/datos-iniciales.sql`
3. Click **"Ejecutar"**

✅ Datos insertados

---

### **Opción B: Con Línea de Comandos**

```powershell
cd "c:\Users\thesh\Documents\SHADOWS.DOCS\UN.RENIMNTON\VII Semestre\LINEA_ENFASIS_1\proyecto-movesmart\backend"

mysql -u root move_smart_db < sql/datos-iniciales.sql
```

---

### Verificar Datos

En phpMyAdmin, click en **"rutas"**:

```
✅ 5 rutas de Manizales
   • Centro - Fundadores
   • Palogrande - Villamaría
   • Neira - Industrial
   • Arví - Puerto Íguana
   • La Macarena - Cervantes
```

---

## **PASO 5: Correr Script de Migración**

El script `migrate-to-mysql.js` transfiere datos de `db.json` a MySQL.

### Ejecutar Script

Abre **PowerShell** en la carpeta backend:

```powershell
cd "c:\Users\thesh\Documents\SHADOWS.DOCS\UN.RENIMNTON\VII Semestre\LINEA_ENFASIS_1\proyecto-movesmart\backend"

node migrate-to-mysql.js
```

### Salida Esperada

```
============================================================
INICIAR MIGRACIÓN DE db.json A MySQL
============================================================

✅ db.json leído correctamente
✅ Backup creado: backups/db-backup-2025-02-08T10-30-45.json

============================================================
CONECTAR A MySQL
============================================================

ℹ️  Conectado a MySQL: move_smart_db

============================================================
MIGRAR DATOS
============================================================

ℹ️  Migrando 5 rutas...
✅ 5/5 rutas migradas
ℹ️  Migrando 9 vehículos...
✅ 9/9 vehículos migrados
ℹ️  Migrando 40 paradas...
✅ 40/40 paradas migradas

============================================================
VERIFICAR MIGRACIÓN
============================================================

ℹ️  Verificando integridad de datos...
✅ Verificación completada:
   • Rutas: 5
   • Vehículos: 9
   • Paradas: 40

============================================================
MIGRACIÓN COMPLETADA EXITOSAMENTE
============================================================

✅ MIGRACIÓN EXITOSA

📁 Backup guardado en: backups/db-backup-2025-02-08T10-30-45.json

📊 Datos migrados:
   • 5 rutas
   • 9 vehículos
   • 40 paradas

🔧 Próximos pasos:
   1. Verifica en phpMyAdmin: http://localhost/phpmyadmin
   2. Actualiza backend/.env: USE_LOCAL_DB=false
   3. Reinicia el servidor: npm run start
   4. Prueba los endpoints: http://localhost:3000/api/routes
```

✅ Si ves esto, la migración fue **EXITOSA**

---

## **PASO 6: Actualizar Configuración**

Cambia el archivo `backend/.env`:

### Archivo: `backend/.env`

**BUSCA ESTA LÍNEA:**

```env
USE_LOCAL_DB=true
```

**CÁMBIALA A:**

```env
USE_LOCAL_DB=false
```

**VERIFICA ESTAS LÍNEAS (para XAMPP):**

```env
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
DB_NAME=move_smart_db
```

💾 **Guarda el archivo** (Ctrl+S)

---

## **PASO 7: Verificar Migración**

### 1️⃣ En phpMyAdmin

Abre: `http://localhost/phpmyadmin`

Click en **"move_smart_db"** → Deberías ver:

```sql
✅ Tabla usuarios: 6 registros
✅ Tabla rutas: 5 registros
✅ Tabla paradas: 40+ registros
```

### 2️⃣ Reinicia el Backend

```powershell
cd backend
npm run start
```

Deberías ver:

```
💾 Base de datos: MySQL  ← (antes era: LOCAL)
✅ SERVIDOR INICIADO CORRECTAMENTE
🚀 Servidor corriendo en http://localhost:3000
```

### 3️⃣ Prueba los Endpoints

Abre en navegador o Postman:

```
http://localhost:3000/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "db": "connected",
  "database": "MySQL",
  "timestamp": "2025-02-08T10:45:30.123Z",
  "environment": "development"
}
```

```
http://localhost:3000/api/routes
```

Respuesta esperada:

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "nombre": "Centro - Fundadores",
      "codigo": "R001",
      "origen": "Terminal Central",
      "destino": "Barrio Fundadores",
      "distancia_km": 8.5,
      "tiempo_estimado_min": 35
    },
    ...
  ]
}
```

✅ **¡Migración completa!**

---

## 🚨 **Solución de Problemas**

### ❌ Error: "XAMPP MySQL no inicia"

**Solución:**

```powershell
# Abre PowerShell como Administrador
cd C:\xampp\mysql\bin

# Reinicia el servicio
net stop MySQL80
net start MySQL80
```

O desde XAMPP Control Panel:
1. Click **"Stop"** en MySQL
2. Espera 5 segundos
3. Click **"Start"** en MySQL

---

### ❌ Error: "Access denied for user 'root'@'localhost'"

**Significa:** XAMPP tiene una contraseña en MySQL

**Solución:**
Edita `backend/.env` y añade la contraseña:

```env
DB_PASSWORD=tu_contraseña_de_xampp
```

Si no recuerdas la contraseña:
1. Abre phpMyAdmin
2. Usa **"without password"** login
3. Resetea la contraseña en phpMyAdmin

---

### ❌ Error: "Database 'move_smart_db' doesn't exist"

**Significa:** No ejecutaste el Paso 2

**Solución:**
Ejecuta de nuevo la creación de BD:

```powershell
mysql -u root -e "CREATE DATABASE move_smart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

### ❌ Error: "Table 'users' doesn't exist"

**Significa:** No ejecutaste el schema.sql

**Solución:**
Ejecuta el schema desde phpMyAdmin o línea de comandos:

```powershell
mysql -u root move_smart_db < backend\sql\schema.sql
```

---

### ❌ Error al ejecutar migrate-to-mysql.js: "ENOENT: no such file or directory"

**Significa:** No estás en la carpeta backend

**Solución:**

```powershell
cd proyecto-movesmart/backend
node migrate-to-mysql.js
```

---

### ❌ Error: "Cannot find module 'mysql2'"

**Significa:** Falta instalar dependencias

**Solución:**

```powershell
cd backend
npm install
```

---

### ✅ Todo funciona pero todavía ve "LOCAL" en el log

**Significa:** .env no se actualizó correctamente

**Solución:**
1. Cierra el servidor (Ctrl+C)
2. Verifica: `USE_LOCAL_DB=false` en `.env`
3. Reinicia: `npm run start`

---

## ❓ **Preguntas Frecuentes**

### P: ¿Puedo volver a db.json si algo falla?

**R:** Sí, en cualquier momento:

```env
USE_LOCAL_DB=true
```

Luego reinicia el servidor.

---

### P: ¿Dónde está el backup?

**R:** En `backend/backups/db-backup-FECHA.json`

Puedes restaurarlo así:

```powershell
cp backups/db-backup-*.json db.json
```

---

### P: ¿Qué si XAMPP no cuenta con MySQL?

**R:** Instala XAMPP completo con MySQL o usa Docker:

```bash
docker run --name xampp-mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0
```

---

### P: ¿Puedo cambiar la contraseña de root?

**R:** Sí, en phpMyAdmin:
1. User accounts
2. Root user
3. Change password

Luego actualiza `backend/.env` con la nueva contraseña.

---

### P: ¿Qué pasa con los datos de db.json?

**R:** 
- Se copian a MySQL automáticamente
- Se crea un backup en `backend/backups/`
- El archivo db.json original se mantiene intacto

---

### P: ¿Puedo tener local Y MySQL al mismo tiempo?

**R:** No simultáneamente, pero puedes cambiar en .env:

```env
USE_LOCAL_DB=true   # ← Usa db.json
# o
USE_LOCAL_DB=false  # ← Usa MySQL
```

---

### P: ¿Necesito hacer esto en producción?

**R:** No, esta migración es para desarrollo. En producción:
- Usa variables de entorno seguros
- Protege credenciales en secretos
- Usa backups diarios

---

## ✅ **Checklist Final**

```
☐ XAMPP MySQL corriendo
☐ Base de datos move_smart_db creada
☐ schema.sql ejecutado (9 tablas)
☐ datos-iniciales.sql ejecutado
☐ migrate-to-mysql.js ejecutado exitosamente
☐ backend/.env cambio a: USE_LOCAL_DB=false
☐ Backend reiniciado: npm run start
☐ Endpoint /api/health devuelve "MySQL"
☐ Endpoint /api/routes devuelve 5 rutas
☐ phpMyAdmin muestra datos en tablas
☐ Backup existe en backend/backups/
```

---

## 🎉 **¡Listo!**

Tu sistema está corriendo con **MySQL en lugar de db.json**.

### Próximos pasos:

1. **Frontend:** Conectar con los endpoints
2. **Autenticación:** Usar tabla usuarios
3. **Producción:** Configurar MySQL real
4. **Backups:** Programar backups diarios

---

## 📞 **Soporte**

Si encuentras problemas:

1. Verifica que MySQL está corriendo
2. Revisa los logs en XAMPP
3. Consulta la sección "Solución de Problemas"
4. Revisa que db.json existe en `backend/db.json`

---

**¡Migración completada! 🚀**
