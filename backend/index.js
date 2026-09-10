import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { initDB } from './config/db.js';
import { attachDB } from './middlewares/attachDB.js';

import usuariosRoutes from './routes/usuariosRoutes.js';
import rutasRoutes from './routes/rutasRoutes.js';


const app = express();

const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// ======================================================
// MIDDLEWARES GLOBALES
// ======================================================

app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'movesmart-backend'
    });
});

// ======================================================
// INICIO DEL SERVIDOR
// ======================================================

const startServer = async () => {
    try {

        // 1. Conectar a MySQL
        const db = await initDB();

        // 2. Inyectar conexión en req.db
        app.use(attachDB(db));

        console.log('✅ Conexión a move_smart_db exitosa');

        // ==================================================
        // RUTAS
        // ==================================================

        app.use('/api/usuarios', usuariosRoutes);

        app.use('/api/rutas', rutasRoutes);

        // ==================================================
        // SERVIDOR
        // ==================================================

        app.listen(PORT, '0.0.0.0', () => {

            console.log(
                `🚀 Move Smart Manizales: http://localhost:${PORT}`
            );

            console.log(
                `📍 Usuarios: /api/usuarios`
            );

            console.log(
                `📍 Rutas: /api/rutas`
            );

            console.log(
                `❤️ Health: /health`
            );
        });

    } catch (error) {

        console.error(
            '❌ Error crítico al iniciar el servidor:',
            error
        );

        // Importante para Docker:
        // si la BD no está disponible, el contenedor debe
        // terminar para que Docker pueda reiniciarlo.
        process.exit(1);
    }
};

startServer();