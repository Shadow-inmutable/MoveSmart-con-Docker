import {
  useEffect,
  useState,
} from "react";

import api from "../api/api";

export default function UsuariosForm() {
  const [usuarios, setUsuarios] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const estadoInicial = {
    nombre: "",
    email: "",
    password: "",
    rol: "gestor",
  };

  const [form, setForm] =
    useState(estadoInicial);

  const [editandoId, setEditandoId] =
    useState(null);

  const fetchUsuarios =
    async () => {
      try {
        setLoading(true);

        const res =
          await api.get(
            "/usuarios"
          );

        setUsuarios(
          res.data?.data || []
        );
      } catch (error) {
        console.error(
          "Error cargando usuarios:",
          error
        );

        alert(
          "No se pudo cargar la lista de usuarios."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const cancelarEdicion = () => {
    setForm(estadoInicial);
    setEditandoId(null);
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        if (editandoId) {
          await api.put(
            `/usuarios/${editandoId}`,
            form
          );

          alert(
            "Usuario actualizado correctamente"
          );
        } else {
          await api.post(
            "/usuarios/crear-admin",
            form
          );

          alert(
            "Usuario registrado correctamente"
          );
        }

        cancelarEdicion();
        fetchUsuarios();
      } catch (error) {
        console.error(
          "Error al guardar usuario:",
          error
        );

        const mensajeError =
          error.response?.data
            ?.error ||
          error.response?.data
            ?.message ||
          "Hubo un error al procesar la solicitud";

        alert(mensajeError);
      }
    };

  const handleEdit = (
    usuario
  ) => {
    setEditandoId(
      usuario.id
    );

    setForm({
      nombre:
        usuario.nombre,
      email:
        usuario.email,
      password: "",
      rol:
        usuario.rol,
    });
  };

  const handleDelete =
    async (
      id,
      nombre
    ) => {
      if (
        !window.confirm(
          `¿Estás seguro de que deseas eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`
        )
      ) {
        return;
      }

      try {
        await api.delete(
          `/usuarios/${id}`
        );

        alert(
          "Usuario eliminado correctamente"
        );

        fetchUsuarios();
      } catch (error) {
        console.error(
          "Error al eliminar usuario:",
          error
        );

        alert(
          "No se pudo eliminar el usuario. Verifique los permisos."
        );
      }
    };

  return (
    <div style={containerStyle}>
      {/* CABECERA */}
      <header
        style={
          headerStyle
        }
      >
        <div>
          <h3
            style={
              titleStyle
            }
          >
            👥{" "}
            {editandoId
              ? "Editar Usuario"
              : "Control de Personal"}
          </h3>

          <p
            style={
              subtitleStyle
            }
          >
            {editandoId
              ? `Modificando ID #${editandoId}`
              : "Administra accesos y roles del sistema"}
          </p>
        </div>

        <span
          style={
            counterStyle
          }
        >
          {usuarios.length} usuarios
        </span>
      </header>

      {/* FORMULARIO */}
      <form
        onSubmit={
          handleSubmit
        }
        style={
          formStyle
        }
      >
        <div
          style={{
            gridColumn:
              "span 2",
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            Nombre completo
          </label>

          <input
            style={
              inputStyle
            }
            name="nombre"
            placeholder="Ej: Juan Pérez"
            value={
              form.nombre
            }
            onChange={
              handleChange
            }
            required
          />
        </div>

        <div>
          <label
            style={
              labelStyle
            }
          >
            Correo electrónico
          </label>

          <input
            style={
              inputStyle
            }
            name="email"
            type="email"
            placeholder="usuario@manizales.gov.co"
            value={
              form.email
            }
            onChange={
              handleChange
            }
            required
            disabled={
              editandoId
            }
          />
        </div>

        <div>
          <label
            style={
              labelStyle
            }
          >
            Contraseña
          </label>

          <input
            style={
              inputStyle
            }
            name="password"
            type="password"
            placeholder={
              editandoId
                ? "Sin cambios"
                : "••••••••"
            }
            value={
              form.password
            }
            onChange={
              handleChange
            }
            required={
              !editandoId
            }
          />
        </div>

        <div>
          <label
            style={
              labelStyle
            }
          >
            Rol
          </label>

          <select
            style={
              inputStyle
            }
            name="rol"
            value={
              form.rol
            }
            onChange={
              handleChange
            }
          >
            <option value="ciudadano">
              Ciudadano
            </option>

            <option value="gestor">
              Gestor
            </option>
          </select>
        </div>

        <div
          style={
            actionsStyle
          }
        >
          <button
            type="submit"
            style={
              editandoId
                ? btnUpdateStyle
                : btnStyle
            }
          >
            {editandoId
              ? "Guardar cambios"
              : "Registrar usuario"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={
                cancelarEdicion
              }
              style={
                btnCancelStyle
              }
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTA */}
      <div
        style={
          usersSectionStyle
        }
      >
        <div
          style={
            usersHeaderStyle
          }
        >
          <h4
            style={
              usersTitleStyle
            }
          >
            Usuarios registrados
          </h4>
        </div>

        <div
          style={
            tableWrapperStyle
          }
        >
          {loading ? (
            <p
              style={
                emptyStyle
              }
            >
              Cargando personal...
            </p>
          ) : usuarios.length ===
            0 ? (
            <p
              style={
                emptyStyle
              }
            >
              No hay usuarios registrados aún.
            </p>
          ) : (
            <table
              style={
                tableStyle
              }
            >
              <thead>
                <tr
                  style={
                    tableHeadRowStyle
                  }
                >
                  <th
                    style={
                      tableHeadStyle
                    }
                  >
                    NOMBRE
                  </th>

                  <th
                    style={
                      tableHeadStyle
                    }
                  >
                    EMAIL
                  </th>

                  <th
                    style={
                      tableHeadStyle
                    }
                  >
                    ROL
                  </th>

                  <th
                    style={{
                      ...tableHeadStyle,
                      textAlign:
                        "center",
                    }}
                  >
                    ACCIONES
                  </th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map(
                  (u) => (
                    <tr
                      key={
                        u.id
                      }
                      style={
                        trStyle
                      }
                    >
                      <td
                        style={
                          cellStyle
                        }
                      >
                        {u.nombre}
                      </td>

                      <td
                        style={
                          emailCellStyle
                        }
                      >
                        {u.email}
                      </td>

                      <td
                        style={
                          cellStyle
                        }
                      >
                        <span
                          style={
                            badgeStyle(
                              u.rol
                            )
                          }
                        >
                          {u.rol}
                        </span>
                      </td>

                      <td
                        style={
                          actionsCellStyle
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              u
                            )
                          }
                          style={
                            btnIconEditStyle
                          }
                          title="Editar usuario"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              u.id,
                              u.nombre
                            )
                          }
                          style={
                            btnIconDeleteStyle
                          }
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ESTILOS
============================================================ */

const containerStyle = {
  height: "100%",
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  background: "#FFFFFF",
  padding: "20px",
  borderRadius: "20px",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "10px",
  paddingBottom: "12px",
  marginBottom: "14px",
  borderBottom:
    "1px solid #F0F2F7",
};

const titleStyle = {
  color: "#2B3674",
  margin: 0,
  fontSize: "18px",
  lineHeight: 1.2,
  fontWeight: "800",
};

const subtitleStyle = {
  color: "#A3AED0",
  fontSize: "11px",
  margin:
    "5px 0 0 0",
  lineHeight: 1.4,
};

const counterStyle = {
  flexShrink: 0,
  padding:
    "6px 10px",
  borderRadius: "10px",
  background: "#F4F7FE",
  color: "#2B3674",
  fontSize: "11px",
  fontWeight: "700",
};

const formStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "10px",
  marginBottom: "14px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#2B3674",
  fontSize: "11px",
  fontWeight: "700",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding:
    "9px 11px",
  borderRadius: "10px",
  border:
    "1px solid #E0E5F2",
  outline: "none",
  fontSize: "12px",
  color: "#2B3674",
  background:
    "#F8FAFD",
};

const actionsStyle = {
  gridColumn:
    "span 2",
  display: "flex",
  gap: "8px",
  marginTop: "2px",
};

const btnStyle = {
  background: "#4318FF",
  color: "white",
  border: "none",
  padding:
    "9px 14px",
  borderRadius: "10px",
  fontSize: "11px",
  fontWeight: "700",
  cursor: "pointer",
};

const btnUpdateStyle = {
  ...btnStyle,
  background: "#05CD99",
};

const btnCancelStyle = {
  ...btnStyle,
  background: "#E0E5F2",
  color: "#2B3674",
};

const usersSectionStyle = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
};

const usersHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "7px",
};

const usersTitleStyle = {
  color: "#2B3674",
  margin: 0,
  fontSize: "13px",
  fontWeight: "800",
};

const tableWrapperStyle = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "auto",
  border:
    "1px solid #EDF1F7",
  borderRadius: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse:
    "collapse",
  minWidth: "480px",
};

const tableHeadRowStyle = {
  background:
    "#F8FAFD",
  color: "#A3AED0",
  fontSize: "9px",
};

const tableHeadStyle = {
  padding:
    "8px 7px",
  textAlign: "left",
  fontWeight: "800",
  whiteSpace:
    "nowrap",
};

const cellStyle = {
  padding:
    "9px 7px",
  fontSize: "11px",
  fontWeight: "600",
  color: "#2B3674",
  borderBottom:
    "1px solid #F0F2F7",
};

const emailCellStyle = {
  ...cellStyle,
  color: "#707EAE",
  fontWeight: "500",
};

const actionsCellStyle = {
  ...cellStyle,
  textAlign: "center",
  whiteSpace:
    "nowrap",
};

const trStyle = {
  transition:
    "background-color 0.2s ease",
};

const badgeStyle = (
  rol
) => ({
  display: "inline-block",
  padding:
    "4px 8px",
  borderRadius: "8px",
  fontSize: "9px",
  fontWeight: "800",
  textTransform:
    "uppercase",
  letterSpacing:
    "0.4px",

  background:
    rol === "admin"
      ? "#FFF5F5"
      : rol === "gestor"
      ? "#E3F2FD"
      : "#F4F7FE",

  color:
    rol === "admin"
      ? "#E53E3E"
      : rol === "gestor"
      ? "#1976D2"
      : "#2B3674",

  border:
    rol === "admin"
      ? "1px solid #FEB2B2"
      : rol === "gestor"
      ? "1px solid #90CAF9"
      : "1px solid #E0E5F2",
});

const btnIconStyle = {
  background: "none",
  border: "none",
  padding: "4px",
  cursor: "pointer",
  fontSize: "14px",
  borderRadius: "7px",
};

const btnIconEditStyle = {
  ...btnIconStyle,
  color: "#4318FF",
};

const btnIconDeleteStyle = {
  ...btnIconStyle,
  color: "#E53E3E",
};

const emptyStyle = {
  color: "#A3AED0",
  textAlign: "center",
  fontSize: "11px",
  padding: "20px",
};