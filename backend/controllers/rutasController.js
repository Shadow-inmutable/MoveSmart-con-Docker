// ========================================
// RUTAS
// ========================================

export const getRutas = async (req, res) => {
    try {
        const [routes] = await req.db.query(
            'SELECT * FROM rutas'
        );

        res.json({
            success: true,
            data: routes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const createRuta = async (req, res) => {

    const {
        nombre,
        tipo,
        color_hex,
        distancia_km,
        tiempo_estimado_min
    } = req.body;

    if (!nombre || !distancia_km) {
        return res.status(400).json({
            success: false,
            error: 'Nombre y distancia son obligatorios'
        });
    }

    const tiempo =
        tiempo_estimado_min ||
        Math.round(distancia_km * 3.5);

    const eficiencia =
        Math.floor(Math.random() * (95 - 70 + 1)) + 70;

    try {

        const [result] = await req.db.query(
            `INSERT INTO rutas
            (
                nombre,
                tipo,
                color_hex,
                distancia_km,
                tiempo_estimado_min,
                eficiencia_porcentaje
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                tipo || 'actual',
                color_hex || '#3498db',
                distancia_km,
                tiempo,
                eficiencia
            ]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                tiempo_estimado: tiempo,
                eficiencia
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const updateRuta = async (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        tipo,
        color_hex,
        distancia_km,
        tiempo_estimado_min
    } = req.body;

    try {

        const [actual] = await req.db.query(
            'SELECT * FROM rutas WHERE id = ?',
            [id]
        );

        if (actual.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Ruta no encontrada'
            });
        }

        let nuevoTiempo = tiempo_estimado_min;

        if (!nuevoTiempo && distancia_km) {
            nuevoTiempo = Math.round(
                distancia_km * 3.5
            );
        }

        await req.db.query(
            `UPDATE rutas SET
                nombre = ?,
                tipo = ?,
                color_hex = ?,
                distancia_km = ?,
                tiempo_estimado_min = ?
            WHERE id = ?`,
            [
                nombre || actual[0].nombre,
                tipo || actual[0].tipo,
                color_hex || actual[0].color_hex,
                distancia_km || actual[0].distancia_km,
                nuevoTiempo || actual[0].tiempo_estimado_min,
                id
            ]
        );

        res.json({
            success: true,
            message: 'Ruta actualizada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const deleteRuta = async (req, res) => {

    const { id } = req.params;

    try {

        const [resultado] = await req.db.query(
            'DELETE FROM rutas WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Ruta no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Ruta eliminada'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


// ========================================
// ZONAS CRÍTICAS
// ========================================

export const getZonas = async (req, res) => {

    try {

        const [zonas] = await req.db.query(
            'SELECT * FROM zonas_criticas'
        );

        res.json({
            success: true,
            data: zonas
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const createZona = async (req, res) => {

    const {
        nombre,
        nivel_congestion,
        latitud,
        longitud,
        descripcion_impacto
    } = req.body;

    if (
        !nombre ||
        latitud === undefined ||
        longitud === undefined
    ) {
        return res.status(400).json({
            success: false,
            error: 'Faltan datos'
        });
    }

    try {

        await req.db.query(
            `INSERT INTO zonas_criticas
            (
                nombre,
                nivel_congestion,
                latitud,
                longitud,
                descripcion_impacto
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                nombre,
                nivel_congestion,
                latitud,
                longitud,
                descripcion_impacto
            ]
        );

        res.json({
            success: true,
            message: 'Zona crítica registrada'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const putZona = async (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        nivel_congestion,
        latitud,
        longitud,
        descripcion_impacto
    } = req.body;

    try {

        const [actual] = await req.db.query(
            'SELECT * FROM zonas_criticas WHERE id = ?',
            [id]
        );

        if (actual.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Zona no encontrada'
            });
        }

        await req.db.query(
            `UPDATE zonas_criticas SET
                nombre = ?,
                nivel_congestion = ?,
                latitud = ?,
                longitud = ?,
                descripcion_impacto = ?
            WHERE id = ?`,
            [
                nombre || actual[0].nombre,
                nivel_congestion || actual[0].nivel_congestion,
                latitud !== undefined
                    ? latitud
                    : actual[0].latitud,
                longitud !== undefined
                    ? longitud
                    : actual[0].longitud,
                descripcion_impacto ||
                    actual[0].descripcion_impacto,
                id
            ]
        );

        res.json({
            success: true,
            message: 'Zona crítica actualizada'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const deleteZona = async (req, res) => {

    const { id } = req.params;

    try {

        const [resultado] = await req.db.query(
            'DELETE FROM zonas_criticas WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Zona no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Zona crítica eliminada'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


// ========================================
// PARADAS
// ========================================

export const getParada = async (req, res) => {

    try {

        const [rows] = await req.db.query(
            'SELECT * FROM paradas ORDER BY ruta_id, orden ASC'
        );

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const createParada = async (req, res) => {

    const {
        ruta_id,
        nombre,
        latitud,
        longitud,
        orden
    } = req.body;

    try {

        await req.db.query(
            `INSERT INTO paradas
            (
                ruta_id,
                nombre,
                latitud,
                longitud,
                orden
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                ruta_id,
                nombre,
                latitud,
                longitud,
                orden
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Parada añadida'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const updateParada = async (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        latitud,
        longitud,
        orden
    } = req.body;

    try {

        const [actual] = await req.db.query(
            'SELECT * FROM paradas WHERE id = ?',
            [id]
        );

        if (actual.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Parada no encontrada'
            });
        }

        await req.db.query(
            `UPDATE paradas SET
                nombre = ?,
                latitud = ?,
                longitud = ?,
                orden = ?
            WHERE id = ?`,
            [
                nombre || actual[0].nombre,
                latitud !== undefined
                    ? latitud
                    : actual[0].latitud,
                longitud !== undefined
                    ? longitud
                    : actual[0].longitud,
                orden !== undefined
                    ? orden
                    : actual[0].orden,
                id
            ]
        );

        res.json({
            success: true,
            message: 'Parada actualizada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const deleteParada = async (req, res) => {

    const { id } = req.params;

    try {

        const [resultado] = await req.db.query(
            'DELETE FROM paradas WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Parada no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Parada eliminada'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};