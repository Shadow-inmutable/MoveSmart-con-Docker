import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importaciones de configuración y base de datos
import { initDB } from './config/db.js'; 
import { attachDB } from './middlewares/attachDB.js';

// Importación de los nuevos archivos de rutas
import usuariosRoutes from './routes/usuariosRoutes.js';
import rutasRoutes from './routes/rutasRoutes.js';

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales 
app.use(cors({
    origin: 'http://localhost:5173', // URL de tu React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

/**
 * Inicio del Servidor y Conexión de Rutas
 */
const startServer = async () => {
    try {
        // 1. Inicializar la conexión a MySQL
        const db = await initDB();
        
        // 2. Inyectar la base de datos en cada petición (req.db)
        app.use(attachDB(db));
        console.log(' Conexión a move_smart_db exitosa');

        // ================= DEFINICIÓN DE RUTAS =================

        // Todas las rutas de Registro y Login empezarán con /api/usuarios
        app.use('/api/usuarios', usuariosRoutes);

        // Todas las rutas de Transporte y Zonas empezarán con /api/rutas
        // Esto incluye: /api/rutas, /api/rutas/:id y /api/rutas/zonas
        app.use('/api/rutas', rutasRoutes);

        // ================= LANZAMIENTO =================
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Move Smart Manizales: http://localhost:${PORT}`);
            console.log(`📍 Rutas listas: /api/usuarios y /api/rutas`);
        });

    } catch (error) {
        console.error('❌ Error crítico al iniciar el servidor:', error);
    }
};

startServer();