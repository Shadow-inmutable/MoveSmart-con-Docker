import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Crea y verifica el pool de conexiones MySQL.
 *
 * El pool permite reutilizar conexiones y atender
 * múltiples peticiones simultáneamente.
 */
export const createMySQLConnection = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,

            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,

            enableKeepAlive: true,
            keepAliveInitialDelayMs: 0
        });

        // Verificar que MySQL esté disponible
        await pool.query('SELECT 1');

        console.log(
            `✅ Conexión exitosa a MySQL: ${process.env.DB_NAME}`
        );

        return pool;

    } catch (error) {
        console.error(
            '❌ Error fatal al conectar con MySQL:',
            error.message
        );

        throw error;
    }
};

/**
 * Inicializador utilizado por index.js.
 */
export const initDB = async () => {
    return await createMySQLConnection();
};