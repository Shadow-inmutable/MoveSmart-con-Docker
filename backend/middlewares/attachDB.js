/**
 * Middleware: Inyecta la conexión de BD en cada request
 * Permite acceder a req.db en todos los controladores
 */
export const attachDB = (db) => {
    return (req, res, next) => {
        req.db = db;
        next();
    };
};
