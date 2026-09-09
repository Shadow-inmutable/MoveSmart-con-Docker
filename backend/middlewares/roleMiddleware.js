export const requireRole = (...rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
};