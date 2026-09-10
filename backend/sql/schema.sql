SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS move_smart_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE move_smart_db;


-- ==========================================
-- TABLA: rutas
-- ==========================================

CREATE TABLE IF NOT EXISTS rutas (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('actual', 'optimizada') DEFAULT 'actual',
    color_hex VARCHAR(7) DEFAULT '#69db34',
    distancia_km DECIMAL(5,2) DEFAULT 0.00,
    tiempo_estimado_min INT DEFAULT 0,
    eficiencia_porcentaje INT DEFAULT 0,

    PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- TABLA: usuarios
-- ==========================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'gestor', 'ciudadano') DEFAULT 'ciudadano',
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- TABLA: zonas_criticas
-- ==========================================

CREATE TABLE IF NOT EXISTS zonas_criticas (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) DEFAULT NULL,
    nivel_congestion ENUM('bajo', 'medio', 'alto') DEFAULT NULL,
    descripcion_impacto TEXT DEFAULT NULL,
    latitud DECIMAL(10,8) DEFAULT NULL,
    longitud DECIMAL(11,8) DEFAULT NULL,
    radio_metros INT DEFAULT 300,

    PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- TABLA: paradas
-- ==========================================

CREATE TABLE IF NOT EXISTS paradas (
    id INT NOT NULL AUTO_INCREMENT,
    ruta_id INT DEFAULT NULL,
    nombre VARCHAR(100) DEFAULT NULL,
    latitud DECIMAL(10,8) DEFAULT NULL,
    longitud DECIMAL(11,8) DEFAULT NULL,
    orden INT NOT NULL DEFAULT 1,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_paradas_ruta_id (ruta_id),

    CONSTRAINT fk_paradas_ruta
        FOREIGN KEY (ruta_id)
        REFERENCES rutas(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;