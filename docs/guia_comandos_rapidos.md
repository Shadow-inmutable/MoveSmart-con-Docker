# ⚡ HOJA DE TRUCOS: Comandos Rápidos

> **Copy-paste commands para la migración**

---

## 🚀 **8 PASOS EN COMANDOS (Copy-Paste)**

### **PASO 1: Iniciar XAMPP**

```powershell
# Abre XAMPP
C:\xampp\xampp-control.exe

# Luego click en "Start" para MySQL (GUI)
```

---

### **PASO 2: Crear Base de Datos**

**Opción A: phpMyAdmin (GUI)**
```
http://localhost/phpmyadmin
→ Especial → Crear Nueva BD
→ Nombre: move_smart_db
→ Collation: utf8mb4_unicode_ci
→ Crear
```

**Opción B: PowerShell (Rápido)**
```powershell
cd "C:\xampp\mysql\bin"

mysql -u root -e "CREATE DATABASE move_smart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

### **PASO 3: Crear Tablas**

```powershell
cd "c:\Users\thesh\Documents\SHADOWS.DOCS\UN.RENIMNTON\VII Semestre\LINEA_ENFASIS_1\proyecto-movesmart\backend"

mysql -u root move_smart_db < sql\schema.sql
```

✅ Espera sin mensajes = éxito

---

### **PASO 4: Insertar Datos Iniciales** (Opcional)

```powershell
mysql -u root move_smart_db < sql\datos-iniciales.sql
```

---

### **PASO 5: Ejecutar Migración** (Si usas db.json)

```powershell
cd backend

node migrate-to-mysql.js
```

Espera a ver:
```
✅ MIGRACIÓN COMPLETADA EXITOSAMENTE
```

---

### **PASO 6: Actualizar .env**

Edita `backend/.env` (Con cualquier editor):

```env
# Cambiar:
USE_LOCAL_DB=false

# Dejar igual (para XAMPP):
DB_USER=root
DB_PASSWORD=
```

---

### **PASO 7: Instalar Dependencias** (Si no las tienes)

```powershell
cd backend

npm install
```

---

### **PASO 8: Iniciar Backend**

```powershell
npm run start
```

Deberías ver:
```
💾 Base de datos: MySQL
✅ SERVIDOR INICIADO CORRECTAMENTE
🚀 Servidor corriendo en http://localhost:3000
```

---

## 🔍 **VERIFICACIÓN RÁPIDA**

### Ver Base de Datos Creada
```powershell
cd "C:\xampp\mysql\bin"

mysql -u root -e "SHOW DATABASES;"
```

Debe mostrar: `move_smart_db`

### Ver Tablas Creadas
```powershell
mysql -u root move_smart_db -e "SHOW TABLES;"
```

Debe mostrar 9 tablas.

### Ver Datos Migrados
```powershell
mysql -u root move_smart_db -e "SELECT COUNT(*) as rutas FROM rutas;"
```

Debe mostrar: `5`

### Probar API en Navegador
```
http://localhost:3000/api/health
http://localhost:3000/api/routes
```

---

## 🔧 **TROUBLESHOOTING RÁPIDO**

### "MySQL no inicia"
```powershell
# PowerShell como Administrador:
net stop MySQL80
net start MySQL80
```

### "Access denied"
En `backend/.env` agrega contraseña:
```env
DB_PASSWORD=tu_contraseña_xampp
```

### "Database doesn't exist"
```powershell
mysql -u root -e "CREATE DATABASE move_smart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### "Table doesn't exist"
```powershell
cd backend
mysql -u root move_smart_db < sql\schema.sql
```

### "Cannot find module"
```powershell
cd backend
npm install
npm install mysql2
```

---

## 💾 **COMANDOS DE BACKUP/RESTORE**

### Crear Backup Manual
```powershell
mysqldump -u root move_smart_db > backup-manual-$(Get-Date -Format "yyyy-MM-dd-HHmmss").sql
```

### Restaurar desde Backup
```powershell
mysql -u root move_smart_db < backup-2025-02-08-103045.sql
```

### Guardar/Restaurar JSON
```bash
# Guardar backup local
cp backend/db.json backend/backups/db-backup-manual.json

# Restaurar de backup
cp backend/backups/db-backup-manual.json backend/db.json
```

---

## 🔄 **CAMBIAR ENTRE DB LOCAL Y MYSQL**

### Usar DB Local (db.json)
Edita `backend/.env`:
```env
USE_LOCAL_DB=true
```

Luego reinicia:
```powershell
npm run start
```

### Usar MySQL
Edita `backend/.env`:
```env
USE_LOCAL_DB=false
```

Luego reinicia:
```powershell
npm run start
```

---

## 🧪 **TESTING RÁPIDO**

### Probar Health
```powershell
curl http://localhost:3000/api/health
```

O en navegador:
```
http://localhost:3000/api/health
```

### Probar Rutas
```powershell
curl http://localhost:3000/api/routes
```

### Probar Vehículos
```powershell
curl http://localhost:3000/api/vehicles
```

### Probar Paradas
```powershell
curl http://localhost:3000/api/stops
```

---

## 📊 **Queries SQL Útiles**

### Contar Datos por Tabla
```sql
SELECT COUNT(*) as total FROM usuarios;
SELECT COUNT(*) as total FROM rutas;
SELECT COUNT(*) as total FROM paradas;
```

### Ver Estructura de Tabla
```sql
DESCRIBE usuarios;
DESCRIBE rutas;
SHOW KEYS FROM rutas;
```

### Ver Datos de Tabla
```sql
SELECT * FROM usuarios LIMIT 5;
SELECT * FROM rutas;
SELECT COUNT(*) FROM paradas GROUP BY ruta_id;
```

---

## 🎯 **Atajo: TODO en Uno** (Copy-Paste)

```powershell
# 1. NAVEgación correcta
cd "c:\Users\thesh\Documents\SHADOWS.DOCS\UN.RENIMNTON\VII Semestre\LINEA_ENFASIS_1\proyecto-movesmart\backend"

# 2. Crear BD
cd "C:\xampp\mysql\bin"
mysql -u root -e "CREATE DATABASE move_smart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 3. Crear tablas
cd "c:\Users\thesh\Documents\SHADOWS.DOCS\UN.RENIMNTON\VII Semestre\LINEA_ENFASIS_1\proyecto-movesmart\backend"
mysql -u root move_smart_db < sql\schema.sql

# 4. Insertar datos (opcional)
mysql -u root move_smart_db < sql\datos-iniciales.sql

# 5. Ejecutar migración (si usas db.json)
node migrate-to-mysql.js

# 6. Actualizar .env (MANUAL - editar en VS Code)
# Cambiar USE_LOCAL_DB=false

# 7. Instalar dependencias
npm install

# 8. Iniciar
npm run start
```

---

## 📝 **Notas Rápidas**

- **Puerto MySQL:** 3306 (por defecto en XAMPP)
- **Usuario:** root (por defecto en XAMPP)
- **Contraseña:** (vacía por defecto en XAMPP)
- **Puerto API:** 3000 (configurable en .env)
- **BD nombre:** move_smart_db (configurable en .env)

---

## ✅ **Verify All Works**

```powershell
# En terminal:
npm run start

# En navegador:
http://localhost:3000/api/health
http://localhost:3000/api/routes
```

Si ves JSON válido → **¡LISTO!** ✨

---

**Guardar esta hoja como referencia rápida** 📌
