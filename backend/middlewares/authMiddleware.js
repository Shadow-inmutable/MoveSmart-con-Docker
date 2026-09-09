import jwt from 'jsonwebtoken';

const getJwtSecret = () => {

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET no está configurado');
    }

    return secret;
};

export const verificarToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: 'Token requerido'
        });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            error: 'Formato de token inválido'
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            getJwtSecret()
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            error: 'Token inválido o expirado'
        });

    }
};