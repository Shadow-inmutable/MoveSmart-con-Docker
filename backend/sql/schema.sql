CREATE DATABASE IF NOT EXISTS move_smart_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE move_smart_db;

-- 🔐 Cumple Punto 7 y 8: Autenticación y Roles
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'gestor', 'ciudadano') DEFAULT 'ciudadano'
);

-- 📊 Cumple Punto 9 y 11: Gráficos de movilidad y Lógica simulada
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('actual', 'optimizada') DEFAULT 'actual',
    color_hex VARCHAR(7) DEFAULT '#69db34',
    distancia_km DECIMAL(5, 2) DEFAULT 0.0,
    tiempo_estimado_min INT DEFAULT 0,
    eficiencia_porcentaje INT DEFAULT 0
);

-- 📍 Cumple Punto 3 y 5: Visualización de paradas en Leaflet.js
CREATE TABLE paradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT,
    nombre VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    orden INT NOT NULL DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE
);

-- ⚠️ Cumple Punto 2 y 11: Información sobre zonas críticas y análisis
CREATE TABLE zonas_criticas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    nivel_congestion ENUM('bajo', 'medio', 'alto'),
    descripcion_impacto TEXT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    radio_metros INT DEFAULT 300
);