import { useState } from 'react';
import api from "../api/api";
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/usuarios/login', { email, password });
      
      // Guardamos la sesión
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 🔀 REDIRECCIÓN POR ROL
      if (['admin', 'gestor'].includes(data.user.rol)) {
        navigate('/dashboard'); // Si es gestor, va al panel de analítica
      } else {
        navigate('/'); // Si es ciudadano, va al mapa normal
      }

    } catch (err) {
      alert('Error en el acceso: ' + (err.response?.data?.error || 'Credenciales inválidas'));
    }
  };

  // --- NUEVOS ESTILOS MODERNOS ---
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundImage: "url('https://i.pinimg.com/736x/33/2d/e4/332de40e17a6e78476f96226073c0adf.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.4), rgba(0, 0, 0, 0.7))',
    zIndex: 1,
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.92)', // Un blanco casi puro pero con leve transparencia
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
    color: '#2B3674', // Azul profundo moderno
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '-1px',
  };

  const subtitleStyle = {
    marginBottom: '2rem',
    color: '#707EAE', // Gris azulado moderno
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
    background: '#4318FF', // Azul vibrante estilo Dashboard Moderno
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.23)',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      <div style={cardStyle}>
        <div style={{fontSize: '40px', marginBottom: '10px'}}>🚌</div>
        <h1 style={titleStyle}>Move Smart</h1>
        <p style={subtitleStyle}>Ingresa tus credenciales para gestionar la ciudad</p>

        <form onSubmit={handleLogin}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = '#3311DB';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#4318FF';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Iniciar Sesión
          </button>

          <p
          style={{
            marginTop: '25px',
            fontSize: '0.85rem',
            color: '#707EAE',
          }}
        >
          ¿No tienes una cuenta?{' '}

          <Link
            to="/register"
            style={{
              color: '#4318FF',
              textDecoration: 'none',
              fontWeight: '700',
            }}
          >
            Crear una cuenta
          </Link>
        </p>
        </form>
        
        <p style={{marginTop: '25px', fontSize: '0.8rem', color: '#707EAE'}}>
          Manizales • Sistema de Gestión de Movilidad
        </p>
      </div>
    </div>
  );
}