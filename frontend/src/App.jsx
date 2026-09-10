
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Mapa from './pages/Mapa';
import Dashboard from './pages/Dashboard';
import ParadasForm from './pages/ParadasForms';
import RutasForm from './pages/RutasForm';
import ZonasForm from './pages/ZonasForms';
import User from './pages/User';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ===============
          RUTAS PÚBLICAS
        ======================*/}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mapa" element={<Mapa />} />

        {/* ==================================
          RUTAS PROTEGIDAS PARA EL ADMINISTRADOR Y GESTOR
        =======================================*/}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'gestor']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/paradas" element={<ParadasForm />} />
          <Route path="/rutas" element={<RutasForm />} />
          <Route path="/zonas" element={<ZonasForm />} />
        </Route>


        {/* =========================================
                RUTA EXCLUSIVA DEL ADMIN
         ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
          <Route path="/usuarios"element={<User />}/>
        </Route>

        {/* Redirección por defecto si la URL no existe */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;