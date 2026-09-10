import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const createMySQLConnection = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,

            // Configuración explícita para trabajar con UTF-8 completo
            charset: 'utf8mb4',

            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelayMs: 0
        });

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

export const initDB = async () => {
    return await createMySQLConnection();
};