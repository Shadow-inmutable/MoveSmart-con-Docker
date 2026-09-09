import express from 'express';
import { getUsuarios, updateUsuario, deleteUsuario, registro, login, crearUsuarioAdmin } from '../controllers/usuariosController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ========================================
// RUTAS PÚBLICAS
// ========================================

// Registro público.
// Todos los usuarios registrados aquí serán ciudadanos.
router.post('/register', registro);

// Inicio de sesión.
router.post('/login', login);

// RUTAS ADMINISTRATIVAS

router.post('/crear-admin',verificarToken, requireRole('admin'), crearUsuarioAdmin);
router.get('/', verificarToken, requireRole('admin'), getUsuarios);
router.put('/:id', verificarToken, requireRole('admin'), updateUsuario);
router.delete('/:id', verificarToken, requireRole('admin'), deleteUsuario);
export default router;