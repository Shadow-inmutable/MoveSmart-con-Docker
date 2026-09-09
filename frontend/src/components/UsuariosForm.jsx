import { useEffect, useState } from "react";
import api from "../api/api";

export default function UsuariosForm() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado inicial del formulario
  const estadoInicial = { nombre: "", email: "", password: "", rol: "gestor" };
  const [form, setForm] = useState(estadoInicial);
  const [editandoId, setEditandoId] = useState(null); // Para saber si estamos editando

  //  fetchUsuarios: Carga la lista de usuarios
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get("/usuarios"); // Tu endpoint GET /usuarios
      // Asumimos que la API responde con { success: true, data: [...] }
      setUsuarios(res.data?.data || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      alert("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Limpiar formulario y estados de edición
  const cancelarEdicion = () => {
    setForm(estadoInicial);
    setEditandoId(null);
  };

  // 🟢 CREAR O ACTUALIZAR USUARIO
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if (editandoId) {
            await api.put(`/usuarios/${editandoId}`, form);
            alert("Usuario actualizado correctamente");
        } else {
            await api.post("/usuarios/crear-admin", form);
            alert("Usuario registrado correctamente");
        }

        cancelarEdicion();
        fetchUsuarios();

    } catch (error) {
        console.error("Error al guardar usuario:", error);

        const mensajeError =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Hubo un error al procesar la solicitud";

        alert(mensajeError);
    }
};

  // 🟡 PREPARAR EDICIÓN
  const handleEdit = (usuario) => {
    setEditandoId(usuario.id);
    // Cargamos los datos en el formulario (excepto la contraseña por seguridad)
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "", // Normalmente no se envía la contraseña actual al editar
      rol: usuario.rol
    });
    // Opcional: hacer scroll hacia arriba si el formulario es largo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔴 ELIMINAR USUARIO
  const handleDelete = async (id, nombre) => {
    // Confirmación de seguridad
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await api.delete(`/usuarios/${id}`); // Tu endpoint DELETE /usuarios/:id
      alert("Usuario eliminado correctamente");
      fetchUsuarios(); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario. Verifique los permisos.");
    }
  };

  return (
    <div style={cardStyle}>
      <header style={{ marginBottom: "25px", borderBottom: "1px solid #F4F7FE", paddingBottom: "15px" }}>
        <h3 style={{ color: "#2B3674", margin: 0, fontSize: "20px", fontWeight: "700" }}>
          👥 {editandoId ? "Editar Usuario" : "Control de Personal"}
        </h3>
        <p style={{ color: "#A3AED0", fontSize: "14px", margin: "5px 0 0 0" }}>
          {editandoId ? `Modificando ID #${editandoId}` : "Administra los accesos y roles del sistema Move Smart"}
        </p>
      </header>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "30px" }}>
        <div style={{gridColumn: "span 2"}}>
          <label style={labelStyle}>Nombre Completo</label>
          <input 
            style={inputStyle} 
            name="nombre"
            placeholder="Ej: Juan Pérez" 
            value={form.nombre}
            onChange={handleChange} 
            required
          />
        </div>
        
        <div>
          <label style={labelStyle}>Correo Electrónico</label>
          <input 
            style={inputStyle} 
            name="email"
            type="email"
            placeholder="juan.perez@manizales.gov.co" 
            value={form.email}
            onChange={handleChange} 
            required
            disabled={editandoId} // Opcional: no permitir cambiar el email si es la clave de login
          />
        </div>

        <div>
          <label style={labelStyle}>Contraseña {editandoId && "(dejar en blanco para no cambiar)"}</label>
          <input 
            style={inputStyle} 
            name="password"
            type="password" 
            placeholder="••••••••" 
            value={form.password}
            onChange={handleChange} 
            required={!editandoId} // Solo requerida si es un usuario nuevo
          />
        </div>

        <div>
          <label style={labelStyle}>Rol de Sistema</label>
          <select 
            style={inputStyle} 
            name="rol"
            value={form.rol}
            onChange={handleChange}
          >
            <option value="ciudadano">Ciudadano (Solo Lectura)</option>
            <option value="gestor">Gestor</option>
            </select>
        </div>

        <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" style={editandoId ? btnUpdateStyle : btnStyle}>
            {editandoId ? "Guardar Cambios" : "Registrar Nuevo Usuario"}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicion} style={btnCancelStyle}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* TABLA DE USUARIOS */}
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ color: "#2B3674", marginBottom: "15px" }}>Usuarios Registrados</h4>
        
        {loading ? (
          <p style={{color: "#A3AED0", textAlign: "center"}}>Cargando personal...</p>
        ) : usuarios.length === 0 ? (
          <p style={{color: "#A3AED0", textAlign: "center"}}>No hay usuarios registrados aún.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#A3AED0", fontSize: "13px", fontWeight: "600", borderBottom: "1px solid #F4F7FE" }}>
                <th style={{ padding: "10px 5px" }}>NOMBRE</th>
                <th style={{ padding: "10px 5px" }}>EMAIL</th>
                <th style={{ padding: "10px 5px" }}>ROL</th>
                <th style={{ padding: "10px 5px", textAlign: "center" }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id} style={trStyle}>
                  <td style={{ padding: "15px 5px", fontSize: "14px", fontWeight: "600", color: "#2B3674" }}>{u.nombre}</td>
                  <td style={{ padding: "15px 5px", fontSize: "14px", color: "#707EAE" }}>{u.email}</td>
                  <td style={{ padding: "15px 5px" }}>
                    <span style={badgeStyle(u.rol)}>{u.rol}</span>
                  </td>
                  <td style={{ padding: "15px 5px", textAlign: "center", display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button 
                      onClick={() => handleEdit(u)} 
                      style={btnIconEditStyle}
                      title="Editar Usuario"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(u.id, u.nombre)} 
                      style={btnIconDeleteStyle}
                      title="Eliminar Usuario"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


const cardStyle = { 
  background: "white", 
  padding: "30px", 
  borderRadius: "20px", 
  boxShadow: "0 10px 30px rgba(112, 144, 176, 0.1)", 
  border: "1px solid #F4F7FE"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#2B3674",
  fontSize: "14px",
  fontWeight: "600"
};

const inputStyle = { 
  padding: "12px 16px", 
  borderRadius: "14px", 
  border: "1px solid #E0E5F2", 
  outline: "none",
  fontSize: "14px",
  color: "#2B3674",
  backgroundColor: "#F4F7FE", 
  width: "100%",
  boxSizing: "border-box" 
};

const btnStyle = { 
  background: "#4318FF", 
  color: "white", 
  border: "none", 
  padding: "12px 24px", 
  borderRadius: "14px", 
  fontWeight: "700", 
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0px 10px 20px rgba(67, 24, 255, 0.2)"
};

const btnUpdateStyle = {
  ...btnStyle,
  background: "#05CD99", 
  boxShadow: "0px 10px 20px rgba(5, 205, 153, 0.2)"
};

const btnCancelStyle = {
  ...btnStyle,
  background: "#E0E5F2",
  color: "#2B3674",
  boxShadow: "none"
};

const trStyle = { 
  borderBottom: "1px solid #F4F7FE",
  transition: "background-color 0.2s ease",
  ':hover': {
    backgroundColor: "#FAFCFE" 
  }
};

const badgeStyle = (rol) => ({
  padding: "5px 12px", 
  borderRadius: "10px", 
  fontSize: "11px", 
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.5px",

  background: rol === "admin" ? "#FFF5F5" : rol === "gestor" ? "#E3F2FD" : "#F4F7FE",
  color: rol === "admin" ? "#E53E3E" : rol === "gestor" ? "#1976D2" : "#2B3674",
  border: rol === "admin" ? "1px solid #FEB2B2" : rol === "gestor" ? "1px solid #90CAF9" : "1px solid #E0E5F2"
});


const btnIconStyle = {
  background: "none",
  border: "none",
  padding: "5px",
  cursor: "pointer",
  fontSize: "16px",
  borderRadius: "8px",
  transition: "background 0.2s"
};

const btnIconEditStyle = {
  ...btnIconStyle,
  color: "#4318FF",
  ':hover': { background: "#E3F2FD" }
};

const btnIconDeleteStyle = {
  ...btnIconStyle,
  color: "#E53E3E",
  ':hover': { background: "#FFF5F5" }
};