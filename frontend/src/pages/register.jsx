import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();

     // =========================
    // VALIDACIONES LOCALES
    // =========================

    if (nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres');
      return;
    }


    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);

      await api.post('/usuarios/register', {
        nombre: nombre.trim(),
        email,
        password,
      });

      alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');

      navigate('/login');

    } catch (err) {
      console.error('Error en el registro:', err);

      alert(
        'Error en el registro: ' +
        (err.response?.data?.error || 'No fue posible crear el usuario')
      );

    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundImage:
      "url('https://i.pinimg.com/736x/33/2d/e4/332de40e17a6e78476f96226073c0adf.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(135deg, rgba(30, 60, 114, 0.4), rgba(0, 0, 0, 0.7))',
    zIndex: 1,
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(10px)',
    padding: '3rem 2.5rem',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  const titleStyle = {
    marginBottom: '0.5rem',
    color: '#2B3674',
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '-1px',
  };

  const subtitleStyle = {
    marginBottom: '2rem',
    color: '#707EAE',
    fontSize: '0.9rem',
    fontWeight: '500',
  };

  const inputGroupStyle = {
    marginBottom: '20px',
    textAlign: 'left',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#2B3674',
    fontSize: '0.85rem',
    fontWeight: '600',
    paddingLeft: '5px',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #E0E5F2',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#F4F7FE',
    color: '#2B3674',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px',
    background: '#4318FF',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '10px',
    boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.23)',
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.3s ease',
  };

  const linkStyle = {
    color: '#4318FF',
    textDecoration: 'none',
    fontWeight: '700',
  };

  return (
    <div style={containerStyle}>

      <div style={overlayStyle}></div>

      <div style={cardStyle}>

        <div style={{ fontSize: '40px', marginBottom: '10px' }}>
          🚌
        </div>

        <h1 style={titleStyle}>
          Crear cuenta
        </h1>

        <p style={subtitleStyle}>
          Regístrate para utilizar Move Smart
        </p>

        <form onSubmit={handleRegistro}>

          {/* NOMBRE */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Nombre completo
            </label>

            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              maxLength={100}
              style={inputStyle}
            />
          </div>

          {/* EMAIL */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Correo Electrónico
            </label>

            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={100}
              style={inputStyle}
            />
          </div>

          {/* PASSWORD */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Contraseña
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Confirmar contraseña
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#3311DB';
                e.target.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#4318FF';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>

        </form>

        {/* VOLVER AL LOGIN */}
        <p
          style={{
            marginTop: '25px',
            fontSize: '0.85rem',
            color: '#707EAE',
          }}
        >
          ¿Ya tienes una cuenta?{' '}

          <Link to="/login" style={linkStyle}>
            Iniciar sesión
          </Link>
        </p>

        <p
          style={{
            marginTop: '20px',
            fontSize: '0.8rem',
            color: '#707EAE',
          }}
        >
          Manizales • Sistema de Gestión de Movilidad
        </p>

      </div>
    </div>
  );
}