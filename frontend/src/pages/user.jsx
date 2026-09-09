import { useEffect, useState } from 'react';
import api from '../api/api';

export default function User() {

    const [usuarios, setUsuarios] = useState([]);

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('ciudadano');

    const [loading, setLoading] = useState(false);

    // =========================================
    // OBTENER USUARIOS
    // =========================================

    const cargarUsuarios = async () => {

        try {

            const { data } = await api.get('/usuarios');

            setUsuarios(data.data || []);

        } catch (error) {

            console.error('Error obteniendo usuarios:', error);

            alert(
                error.response?.data?.error ||
                'No fue posible obtener los usuarios'
            );
        }
    };

    // =========================================
    // CARGAR USUARIOS AL ENTRAR
    // =========================================

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // =========================================
    // CREAR USUARIO
    // =========================================

    const handleCrearUsuario = async (e) => {

        e.preventDefault();

        if (nombre.trim().length < 3) {
            alert('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {

            setLoading(true);

            await api.post('/usuarios/admin', {
                nombre: nombre.trim(),
                email: email.trim(),
                password,
                rol
            });

            alert(`Usuario creado correctamente como ${rol}`);

            // Limpiar formulario
            setNombre('');
            setEmail('');
            setPassword('');
            setRol('ciudadano');

            // Recargar lista
            await cargarUsuarios();

        } catch (error) {

            console.error('Error creando usuario:', error);

            alert(
                error.response?.data?.error ||
                'No fue posible crear el usuario'
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================
    // CAMBIAR ROL
    // =========================================

    const cambiarRol = async (usuario) => {

        const nuevoRol =
            usuario.rol === 'ciudadano'
                ? 'gestor'
                : 'ciudadano';

        const confirmar = window.confirm(
            `¿Deseas cambiar el rol de ${usuario.nombre} a ${nuevoRol}?`
        );

        if (!confirmar) {
            return;
        }

        try {

            await api.put(`/usuarios/${usuario.id}`, {
                rol: nuevoRol
            });

            alert('Rol actualizado correctamente');

            await cargarUsuarios();

        } catch (error) {

            console.error('Error actualizando rol:', error);

            alert(
                error.response?.data?.error ||
                'No fue posible actualizar el usuario'
            );
        }
    };

    // =========================================
    // ELIMINAR USUARIO
    // =========================================

    const eliminarUsuario = async (usuario) => {

        const confirmar = window.confirm(
            `¿Seguro que deseas eliminar a ${usuario.nombre}?`
        );

        if (!confirmar) {
            return;
        }

        try {

            await api.delete(`/usuarios/${usuario.id}`);

            alert('Usuario eliminado correctamente');

            await cargarUsuarios();

        } catch (error) {

            console.error('Error eliminando usuario:', error);

            alert(
                error.response?.data?.error ||
                'No fue posible eliminar el usuario'
            );
        }
    };

    // =========================================
    // ESTILOS
    // =========================================

    const containerStyle = {
        minHeight: '100vh',
        padding: '40px',
        background: '#F4F7FE',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        color: '#2B3674'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
    };

    const inputStyle = {
        width: '100%',
        padding: '13px',
        borderRadius: '12px',
        border: '1px solid #E0E5F2',
        background: '#F4F7FE',
        boxSizing: 'border-box',
        marginTop: '6px',
        marginBottom: '15px',
        color: '#2B3674'
    };

    const buttonStyle = {
        padding: '13px 20px',
        border: 'none',
        borderRadius: '12px',
        background: '#4318FF',
        color: 'white',
        fontWeight: '700',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1
    };

    return (

        <div style={containerStyle}>

            {/* =========================================
                TÍTULO
            ========================================= */}

            <div style={cardStyle}>

                <h1 style={{ marginTop: 0 }}>
                    Administración de usuarios
                </h1>

                <p style={{ color: '#707EAE' }}>
                    Gestiona ciudadanos y gestores de Move Smart.
                </p>

            </div>


            {/* =========================================
                CREAR USUARIO
            ========================================= */}

            <div style={cardStyle}>

                <h2>Crear usuario</h2>

                <form onSubmit={handleCrearUsuario}>

                    <label>
                        Nombre completo
                    </label>

                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre completo"
                        maxLength={100}
                        required
                        style={inputStyle}
                    />


                    <label>
                        Correo electrónico
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        maxLength={100}
                        required
                        style={inputStyle}
                    />


                    <label>
                        Contraseña
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        required
                        style={inputStyle}
                    />


                    <label>
                        Rol
                    </label>

                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        style={inputStyle}
                    >

                        <option value="ciudadano">
                            Ciudadano
                        </option>

                        <option value="gestor">
                            Gestor
                        </option>

                    </select>


                    <button
                        type="submit"
                        disabled={loading}
                        style={buttonStyle}
                    >

                        {loading
                            ? 'Creando...'
                            : 'Crear usuario'}

                    </button>

                </form>

            </div>


            {/* =========================================
                LISTA DE USUARIOS
            ========================================= */}

            <div style={cardStyle}>

                <h2>
                    Usuarios registrados
                </h2>

                {usuarios.length === 0 ? (

                    <p style={{ color: '#707EAE' }}>
                        No hay usuarios registrados.
                    </p>

                ) : (

                    <div style={{ overflowX: 'auto' }}>

                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}
                        >

                            <thead>

                                <tr>

                                    <th style={{ textAlign: 'left', padding: '12px' }}>
                                        ID
                                    </th>

                                    <th style={{ textAlign: 'left', padding: '12px' }}>
                                        Nombre
                                    </th>

                                    <th style={{ textAlign: 'left', padding: '12px' }}>
                                        Email
                                    </th>

                                    <th style={{ textAlign: 'left', padding: '12px' }}>
                                        Rol
                                    </th>

                                    <th style={{ textAlign: 'left', padding: '12px' }}>
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {usuarios.map((usuario) => (

                                    <tr key={usuario.id}>

                                        <td style={{ padding: '12px' }}>
                                            {usuario.id}
                                        </td>

                                        <td style={{ padding: '12px' }}>
                                            {usuario.nombre}
                                        </td>

                                        <td style={{ padding: '12px' }}>
                                            {usuario.email}
                                        </td>

                                        <td style={{ padding: '12px' }}>
                                            {usuario.rol}
                                        </td>

                                        <td style={{ padding: '12px' }}>

                                            <button
                                                onClick={() =>
                                                    cambiarRol(usuario)
                                                }
                                                style={{
                                                    marginRight: '8px',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cambiar rol
                                            </button>

                                            <button
                                                onClick={() =>
                                                    eliminarUsuario(usuario)
                                                }
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Eliminar
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}