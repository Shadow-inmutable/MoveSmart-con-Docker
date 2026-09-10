import { useEffect, useState } from "react";
import api from "../api/api";

export default function ParadasPublicas() {
  const [paradas, setParadas] = useState([]);

  useEffect(() => {
    const fetchParadas = async () => {
      try {
        const res = await api.get("/rutas/paradas");
        if (res.data?.success) {
          setParadas(res.data.data);
        }
      } catch (error) {
        console.error("Error cargando paradas públicas:", error);
      }
    };

    fetchParadas();
  }, []);

  return (
    <div style={{
      width: "320px",
      background: "white",
      borderLeft: "1px solid #e5e7eb",
      padding: "20px",
      overflowY: "auto"
    }}>
      <h3 style={{ marginBottom: "15px", color: "#2b3674" }}>
        🚌 Paradas de la Ruta
      </h3>

      {paradas.length === 0 ? (
        <p style={{ color: "#a3aed0" }}>No hay paradas registradas</p>
      ) : (
        paradas.map((p) => (
          <div key={p.id} style={{
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "12px",
            background: "#f4f7fe"
          }}>
            <strong>{p.nombre || "Parada sin nombre"}</strong>
            <div style={{ fontSize: "13px", color: "#555" }}>
              Orden: {p.orden}
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              Distancia aprox: {(p.orden * 0.5).toFixed(1)} km
            </div>
          </div>
        ))
      )}
    </div>
  );
}