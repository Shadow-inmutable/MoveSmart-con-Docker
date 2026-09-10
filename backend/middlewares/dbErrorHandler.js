/**
 * Middleware: Maneja errores de base de datos
 * Debe usarse como último middleware antes de app.listen()
 */
export const dbErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.error('🔴 Error de BD:', {
        message: err.message,
        code: err.code,
        timestamp: new Date().toISOString()
    });

    res.status(statusCode).json({
        success: false,
        error: 'Error en la base de datos',
        message: isDevelopment ? err.message : 'Error del servidor',
        ...(isDevelopment && { stack: err.stack })
    });
};

