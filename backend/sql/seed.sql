USE move_smart_db;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ==========================================
-- DATOS INICIALES: RUTAS
-- ==========================================

INSERT INTO rutas
    (
        id,
        nombre,
        tipo,
        color_hex,
        distancia_km,
        tiempo_estimado_min,
        eficiencia_porcentaje
    )
VALUES

    (
        2,
        'Alcázares - Lusitania',
        'actual',
        '#47DB33',
        15.00,
        40,
        90
    ),

    (
        4,
        'Centro - Enea',
        'actual',
        '#3498DB',
        11.50,
        30,
        71
    ),

    (
        5,
        'Terminal - Villamaría',
        'actual',
        '#33DB4F',
        2.60,
        12,
        71
    );

-- ==========================================
-- DATOS INICIALES: USUARIOS
-- ==========================================

INSERT INTO usuarios
    (id, nombre, email, password, rol, fecha_registro)
VALUES
    (
        1,
        'Angel',
        'ciudadanoangel@smart.com',
        '$2b$10$ZJ0Z0ufMLa7fjt1tamANLeBvK/w5HlNvuGfPOAt5ync86suBa.AgC',
        'ciudadano',
        '2026-02-24 01:26:13'
    ),
    (
        3,
        'Gestor Brandon',
        'gestorsombra@smart.com',
        '$2b$10$x0E8ITCCqr76CJV8A59MoODBw2cF3A.OjP18XSBHAaEcwHtajNMEG',
        'gestor',
        '2026-02-24 01:26:13'
    ),
    (
        4,
        'Gestor Secretaria',
        'gestorsecretaria@smart.com',
        '$2b$10$9bT3kCKiyotgClQeburtbuRnNlHpyRKNxdKIYVPrDy6eyrq9NwBlC',
        'gestor',
        '2026-02-24 01:26:13'
    ),
    (
        6,
        'Gestor Alcaldia',
        'gestoralcaldia@smart.com',
        '$2b$10$putR0eE75zVGqXOzx6RhF.SOBF/U6.xAvrNarr9igCQbqoMiX/jTq',
        'gestor',
        '2026-02-24 01:26:13'
    ),
    (
        7,
        'Gestor juan',
        'gestorjuan@smart.com',
        '$2b$10$6dbw4nUqqBwIxjpWveCgHuBNCZXUxHtH7ZADCxEXUZfyHHsRzPZR.',
        'gestor',
        '2026-02-24 01:26:13'
    ),
    (
        9,
        'juan',
        'juan@smart.com',
        '$2b$10$5HQM0XeZkew9GR6mg7hQDeOTWOL40ETKz3coHHW0zkohGnJWBOxra',
        'ciudadano',
        '2026-02-24 01:26:13'
    ),
    (
        11,
        'diego',
        'diego@smart.com',
        '$2b$10$j8z2IAUEEc78T.36jpIc/O0TWIockfQnPrZXctxAASqhlCZIOddtW',
        'ciudadano',
        '2026-02-24 01:26:13'
    ),
    (
        15,
        'camilo',
        'gestorcamilo@smart.com',
        '$2b$10$Sy33isrUx9AlDKv7AS3nQ.Hyc5qpsYOoYnYI3wdfBJE6YHOTSS4nu',
        'gestor',
        '2026-02-24 01:26:13'
    ),
    (
        16,
        'pedro',
        'gestorpedro@smart.com',
        '$2b$10$KvKF8GrA.K9uPIs0.esS9uNFtDjYKObeg29smok4ExFswUgD3Tuc6',
        'gestor',
        '2026-02-27 04:33:51'
    ),
    (
        17,
        'Administrador Brandon Move Smart',
        'admin@movesmart.com',
        '$2b$10$Sy33isrUx9AlDKv7AS3nQ.Hyc5qpsYOoYnYI3wdfBJE6YHOTSS4nu',
        'admin',
        '2026-02-24 01:26:13'
    );

-- ==========================================
-- DATOS INICIALES: PARADAS
-- ==========================================
-- ==========================================
-- RUTA 2: ALCÁZARES - LUSITANIA
-- ==========================================

INSERT INTO paradas
    (
        id,
        ruta_id,
        nombre,
        latitud,
        longitud,
        orden
    )
VALUES

    (
        1,
        2,
        'Los Alcázares',
        5.06711000,
        -75.52676000,
        1
    ),

    (
        2,
        2,
        'Chipre',
        5.07584000,
        -75.52544000,
        2
    ),

    (
        3,
        2,
        'Centro Histórico',
        5.06771000,
        -75.51828000,
        3
    ),

    (
        4,
        2,
        'Fundadores',
        5.06759000,
        -75.51042000,
        4
    ),

    (
        5,
        2,
        'Palogrande',
        5.05703000,
        -75.49009000,
        5
    ),

    (
        6,
        2,
        'La Enea',
        5.03182000,
        -75.46306000,
        6
    ),

    (
        7,
        2,
        'Lusitania',
        5.03077000,
        -75.47756000,
        7
    );

-- ==========================================
-- RUTA 4: CENTRO - ENEA
-- ==========================================

INSERT INTO paradas
    (
        id,
        ruta_id,
        nombre,
        latitud,
        longitud,
        orden
    )
VALUES

    (
        8,
        4,
        'Centro Histórico',
        5.06805556,
        -75.51750000,
        1
    ),

    (
        9,
        4,
        'Fundadores',
        5.06759000,
        -75.51042000,
        2
    ),

    (
        10,
        4,
        'Parque de la Mujer',
        5.06522000,
        -75.49923000,
        3
    ),

    (
        11,
        4,
        'Cable Plaza',
        5.05628000,
        -75.48555000,
        4
    ),

    (
        12,
        4,
        'Palogrande',
        5.05703000,
        -75.49009000,
        5
    ),

    (
        13,
        4,
        'Milán',
        5.04590000,
        -75.47986000,
        6
    ),

    (
        14,
        4,
        'La Enea',
        5.03182000,
        -75.46306000,
        7
    );

-- ==========================================
-- RUTA 5: TERMINAL - VILLAMARÍA
-- ==========================================

INSERT INTO paradas
    (
        id,
        ruta_id,
        nombre,
        latitud,
        longitud,
        orden
    )
VALUES

    (
        15,
        5,
        'Terminal de Transportes',
        5.04937000,
        -75.50648000,
        1
    ),

    (
        16,
        5,
        'Los Cámbulos',
        5.05018000,
        -75.50664000,
        2
    ),

    (
        17,
        5,
        'Portal de los Cámbulos',
        5.04776000,
        -75.50616000,
        3
    ),

    (
        18,
        5,
        'Villa Diana',
        5.04641000,
        -75.51717000,
        4
    ),

    (
        19,
        5,
        'Villamaría',
        5.04565000,
        -75.51474000,
        5
    );

-- ==========================================
-- DATOS INICIALES: ZONAS CRÍTICAS
-- ==========================================

-- ==========================================
-- DATOS INICIALES: ZONAS CRÍTICAS
-- ==========================================

INSERT INTO zonas_criticas
    (
        id,
        nombre,
        nivel_congestion,
        descripcion_impacto,
        latitud,
        longitud,
        radio_metros
    )
VALUES

    (
        1,
        'Glorieta de la Autónoma',
        'bajo',
        'Accidente ocasional con afectación temporal de la circulación.',
        5.06890000,
        -75.50390000,
        300
    ),

    (
        2,
        'Sector Estadio Palogrande',
        'alto',
        'Alta concentración vehicular asociada a eventos deportivos y actividades del sector.',
        5.05703000,
        -75.49009000,
        350
    ),

    (
        3,
        'Sector San Marcel',
        'medio',
        'Zona de flujo vehicular y conexión hacia La Enea y sectores del suroriente.',
        5.03566000,
        -75.46963000,
        300
    ),

    (
        4,
        'Sector Chipre',
        'medio',
        'Flujo vehicular asociado al acceso a Chipre y sectores residenciales y turísticos.',
        5.07584000,
        -75.52544000,
        300
    ),

    (
        5,
        'Centro Histórico',
        'medio',
        'Alta actividad comercial, peatonal y vehicular en el centro de Manizales.',
        5.06771000,
        -75.51828000,
        350
    ),

    (
        6,
        'Sector Cable - Milán',
        'alto',
        'Alta concentración de actividad comercial, universitaria y movilidad vehicular.',
        5.05100000,
        -75.48270000,
        350
    ),

    (
        7,
        'Terminal de Transportes',
        'alto',
        'Alta concentración de transporte público, vehículos particulares y pasajeros.',
        5.04937000,
        -75.50648000,
        400
    );