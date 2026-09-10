import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}


// ========================================
// REGISTRO PÚBLICO
// ========================================

export const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // -----------------------------
        // Validaciones básicas
        // -----------------------------

        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Nombre, email y password son requeridos'
            });
        }

        const nombreNormalizado = nombre.trim();
        const emailNormalizado = email.trim().toLowerCase();

        if (nombreNormalizado.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'El nombre debe tener al menos 3 caracteres'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // -----------------------------
        // Comprobar email
        // -----------------------------

        const [usuariosExistentes] = await req.db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [emailNormalizado]
        );

        if (usuariosExistentes.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'El correo electrónico ya está registrado'
            });
        }

        // -----------------------------
        // Encriptar contraseña
        // -----------------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        // -----------------------------
        // Registro público
        // SIEMPRE ciudadano
        // -----------------------------

        await req.db.query(
            `
            INSERT INTO usuarios
            (nombre, email, password, rol)
            VALUES (?, ?, ?, ?)
            `,
            [
                nombreNormalizado,
                emailNormalizado,
                hashedPassword,
                'ciudadano'
            ]
        );

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente'
        });

    } catch (error) {

        console.error('Error en registro:', error);

        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};


// ========================================
// LOGIN
// ========================================

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email y password requeridos'
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const [users] = await req.db.query(
            'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?',
            [emailNormalizado]
        );

        if (
            users.length === 0 ||
            !(await bcrypt.compare(password, users[0].password))
        ) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                id: users[0].id,
                rol: users[0].rol
            },
            JWT_SECRET,
            {
                expiresIn: '4h'
            }
        );

        return res.json({
            success: true,
            token,
            user: {
                id: users[0].id,
                nombre: users[0].nombre,
                email: users[0].email,
                rol: users[0].rol
            }
        });

    } catch (error) {

        console.error('Error en login:', error);

        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};


// ========================================
// CREAR USUARIO DESDE ADMIN
// ========================================

export const crearUsuarioAdmin = async (req, res) => {
    try {

        const {
            nombre,
            email,
            password,
            rol
        } = req.body;

        // -----------------------------
        // Validaciones
        // -----------------------------

        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({
                success: false,
                error: 'Nombre, email, password y rol son requeridos'
            });
        }

        const nombreNormalizado = nombre.trim();
        const emailNormalizado = email.trim().toLowerCase();
        const rolNormalizado = rol.trim().toLowerCase();

        if (nombreNormalizado.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'El nombre debe tener al menos 3 caracteres'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // El administrador puede crear:
        // ciudadano o gestor.
        //
        // No permitimos crear otro admin
        // desde este endpoint.

        const rolesPermitidos = [
            'ciudadano',
            'gestor'
        ];

        if (!rolesPermitidos.includes(rolNormalizado)) {
            return res.status(400).json({
                success: false,
                error: 'Rol no permitido'
            });
        }

        // -----------------------------
        // Comprobar email
        // -----------------------------

        const [usuariosExistentes] = await req.db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [emailNormalizado]
        );

        if (usuariosExistentes.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'El correo electrónico ya está registrado'
            });
        }

        // -----------------------------
        // Hash de contraseña
        // -----------------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        // -----------------------------
        // Crear usuario
        // -----------------------------

        await req.db.query(
            `
            INSERT INTO usuarios
            (nombre, email, password, rol)
            VALUES (?, ?, ?, ?)
            `,
            [
                nombreNormalizado,
                emailNormalizado,
                hashedPassword,
                rolNormalizado
            ]
        );

        return res.status(201).json({
            success: true,
            message: `Usuario creado exitosamente como ${rolNormalizado}`
        });

    } catch (error) {

        console.error('Error creando usuario:', error);

        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};


// ========================================
// LISTAR USUARIOS
// ========================================

export const getUsuarios = async (req, res) => {
    try {

        const [users] = await req.db.query(
            `
            SELECT id, nombre, email, rol
            FROM usuarios
            ORDER BY id DESC
            `
        );

        return res.json({
            success: true,
            data: users
        });

    } catch (error) {

        console.error('Error obteniendo usuarios:', error);

        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};


// ========================================
// ACTUALIZAR USUARIO
// ========================================

export const updateUsuario = async (req, res) => {
    try {

        const { id } = req.params;
        const { nombre, email, rol } = req.body;

        // -----------------------------
        // Buscar usuario
        // -----------------------------

        const [usuarios] = await req.db.query(
            'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?',
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        const usuarioActual = usuarios[0];

        const nuevoNombre = nombre
            ? nombre.trim()
            : usuarioActual.nombre;

        const nuevoEmail = email
            ? email.trim().toLowerCase()
            : usuarioActual.email;

        const nuevoRol = rol
            ? rol.trim().toLowerCase()
            : usuarioActual.rol;

        // -----------------------------
        // Validar nombre
        // -----------------------------

        if (nuevoNombre.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'El nombre debe tener al menos 3 caracteres'
            });
        }

        // -----------------------------
        // Validar rol
        // -----------------------------

        const rolesPermitidos = [
            'ciudadano',
            'gestor',
            'admin'
        ];

        if (!rolesPermitidos.includes(nuevoRol)) {
            return res.status(400).json({
                success: false,
                error: 'Rol no permitido'
            });
        }

        // -----------------------------
        // Verificar email duplicado
        // -----------------------------

        const [emailExistente] = await req.db.query(
            `
            SELECT id
            FROM usuarios
            WHERE email = ?
            AND id != ?
            `,
            [nuevoEmail, id]
        );

        if (emailExistente.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'El correo electrónico ya está registrado'
            });
        }

        // -----------------------------
        // Actualizar
        // -----------------------------

        await req.db.query(
            `
            UPDATE usuarios
            SET nombre = ?, email = ?, rol = ?
            WHERE id = ?
            `,
            [
                nuevoNombre,
                nuevoEmail,
                nuevoRol,
                id
            ]
        );

        return res.json({
            success: true,
            message: 'Usuario actualizado correctamente'
        });

    } catch (error) {

        console.error('Error actualizando usuario:', error);

        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};


// ========================================
// ELIMINAR USUARIO
// ========================================

export const deleteUsuario = async (req, res) => {
    try {

        const { id } = req.params;

        // Evitar eliminar la propia cuenta.
        if (parseInt(id, 10) === req.user.id) {
            return res.status(400).json({
                success: false,
                error: 'No puedes eliminar tu propia cuenta administrativa'
            });
        }

        const [resultado] = await req.db.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Usuario eliminado del sistema'
        });

    } catch (error) {

        console.error('Error eliminando usuario:', error);

        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};