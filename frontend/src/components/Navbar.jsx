import { Link } from 'react-router-dom';

export default function Navbar() {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const titleStyle = {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const linkContainer = {
    display: 'flex',
    gap: '20px',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  };

  const handleMouseEnter = (e) => {
    e.target.style.background = 'rgba(255,255,255,0.15)';
    e.target.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.background = 'transparent';
    e.target.style.transform = 'translateY(0)';
  };

  return (
    <nav style={navStyle}>
      <h2 style={titleStyle}>🚌 Move Smart Manizales</h2>
      <div style={linkContainer}>
        <Link to="/" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Home
        </Link>
        <Link to="/mapa" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Mapa
        </Link>
        <Link to="/login" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Acceso Gestor
        </Link>
      </div>
    </nav>
  );
}