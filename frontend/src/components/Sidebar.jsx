import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Sidebar({ onRutaSelect }) {
  const [rutas, setRutas] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const rutasRes = await api.get("/rutas");
        const zonasRes = await api.get("/rutas/zonas");

        setRutas(rutasRes.data.data || []);
        setZonas(zonasRes.data.data || []);
      } catch (error) {
        console.error("Error cargando datos del sidebar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  /* 🔴 CONVERSIÓN REAL DE NIVEL → PORCENTAJE */
  const nivelToPorcentaje = (nivel) => {
    if (!nivel) return 0;

    const n = nivel.toLowerCase();

    if (n === "bajo") return 20;
    if (n === "medio") return 50;
    if (n === "alto") return 80;
    if (n === "critico") return 95;

    return 0;
  };

  /* 🎨 ESTILOS */
  const sidebarStyle = {
    width: "20%",
    background: "#f5f7fb",
    padding: "24px 20px",
    borderRight: "1px solid #e9ecf2",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    overflowY: "auto",
    height: "100vh",
    fontFamily: "'Inter', sans-serif",
  };

  const card = {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px 18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.02)",
    border: "1px solid #eef2f7",
  };

  const list = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const rutaItem = {
    padding: "16px",
    borderRadius: "16px",
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const zonaItem = {
    padding: "16px",
    borderRadius: "16px",
    background: "#f8fafd",
    border: "1px solid #edf2f9",
  };

  if (loading) {
    return (
      <div style={sidebarStyle}>
        <div style={card}>Cargando información...</div>
      </div>
    );
  }

  return (
    <div style={sidebarStyle}>
      {/* ================= RUTAS ACTIVAS ================= */}
      <div style={card}>
        <h3> 🛣️ Rutas Activas</h3>
        <ul style={list}>
          {rutas.map((ruta) => (
            <li
              key={ruta.id}
              style={rutaItem}
              onClick={() => onRutaSelect && onRutaSelect(ruta)}
            >
              <strong>{ruta.nombre}</strong>
              <p>Distancia: {ruta.distancia_km} km</p>
              <p>Tiempo estimado: {ruta.tiempo_estimado_min} min</p>
            </li>
          ))}
          {/* BOTÓN PARA GESTIONAR RUTAS */}
          <li
            style={{ ...rutaItem, background: "#eef2ff", border: "1px solid #c7d2fe" }}
            onClick={() => navigate("/rutas")}
          >
            🚍 Gestionar Rutas
          </li>
        </ul>
      </div>

      {/* ================= ZONAS CRÍTICAS ================= */}
      <div style={card}>
        <h3> 🚨 Zonas Críticas⚠️</h3>
        <ul style={list}>
          {zonas.map((zona) => {
            const porcentaje = nivelToPorcentaje(zona.nivel_congestion);

            let color = "#22c55e"; // verde
            if (porcentaje >= 85) color = "#ef4444"; // rojo
            else if (porcentaje >= 40) color = "#f59e0b"; // naranja

            return (
              <li key={zona.id} style={zonaItem}>
                <strong>{zona.nombre}</strong>
                <p>Nivel: {zona.nivel_congestion}</p>

                {/* Barra de congestión */}
                <div
                  style={{
                    height: "6px",
                    width: "100%",
                    background: "#e5e7eb",
                    borderRadius: "6px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      width: `${porcentaje}%`,
                      height: "100%",
                      background: color,
                      borderRadius: "6px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>

                <p style={{ marginTop: "6px", fontWeight: "600" }}>
                  {porcentaje}%
                </p>
              </li>
            );
          })}
          <li style={rutaItem} onClick={() => navigate("/zonas")}>
            ⚠️🚨 Gestionar Zonas Críticas
          </li>
        </ul>
      </div>
    </div>
  );
}