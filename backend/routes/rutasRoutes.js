import express from 'express';

import {
    getRutas,
    createRuta,
    updateRuta,
    deleteRuta,
    getZonas,
    createZona,
    putZona,
    deleteZona,
    getParada,
    createParada,
    updateParada,
    deleteParada
} from '../controllers/rutasController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();


// ========================================
// CONSULTAS PÚBLICAS
// ========================================

// Ciudadanos, gestores y administradores
// pueden consultar información de movilidad.

router.get('/', getRutas);

router.get('/zonas', getZonas);

router.get('/paradas', getParada);


// ========================================
// GESTIÓN DE RUTAS
// ========================================

// Gestor y administrador pueden gestionar rutas.

router.post(
    '/',
    verificarToken,
    requireRole('gestor', 'admin'),
    createRuta
);

router.put(
    '/:id',
    verificarToken,
    requireRole('gestor', 'admin'),
    updateRuta
);

router.delete(
    '/:id',
    verificarToken,
    requireRole('gestor', 'admin'),
    deleteRuta
);


// ========================================
// GESTIÓN DE ZONAS CRÍTICAS
// ========================================

// Gestor y administrador pueden gestionar
// zonas críticas.

router.post(
    '/zonas',
    verificarToken,
    requireRole('gestor', 'admin'),
    createZona
);

router.put(
    '/zonas/:id',
    verificarToken,
    requireRole('gestor', 'admin'),
    putZona
);

router.delete(
    '/zonas/:id',
    verificarToken,
    requireRole('gestor', 'admin'),
    deleteZona
);


// ========================================
// GESTIÓN DE PARADAS
// ========================================

// Gestor y administrador pueden gestionar paradas.

router.post(
    '/paradas',
    verificarToken,
    requireRole('gestor', 'admin'),
    createParada
);

router.put(
    '/paradas/:id',
    verificarToken,
    requireRole('gestor', 'admin'),
    updateParada
);

router.delete(
    '/paradas/:id',
    verificarToken,
    requireRole('gestor', 'admin'),
    deleteParada
);

export default router;