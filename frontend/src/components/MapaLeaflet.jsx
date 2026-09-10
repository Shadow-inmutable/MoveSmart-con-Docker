import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Polyline, Tooltip, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api/api";
import { calcularMetricasRutas } from "../../services/motorMovilidad";

export default function MapaLeaflet({
  rutaSeleccionada: rutaSeleccionadaProp = null,
  mostrarSelectorRuta = true,
  onMetricasRuta = null,
}) {
  const [puntos, setPuntos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(rutaSeleccionadaProp);
  const [geometrias, setGeometrias] = useState({});
  const [cargandoRutas, setCargandoRutas] = useState(false);
  const [errorRouting, setErrorRouting] = useState(false);

  const position = [5.0689, -75.5174];

  useEffect(() => {
    setRutaSeleccionada(rutaSeleccionadaProp || null);
  }, [rutaSeleccionadaProp]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paradasRes, zonasRes, rutasRes] = await Promise.all([
          api.get("/rutas/paradas"),
          api.get("/rutas/zonas"),
          api.get("/rutas"),
        ]);
        if (paradasRes.data?.success) setPuntos(paradasRes.data.data || []);
        if (zonasRes.data?.success) setZonas(zonasRes.data.data || []);
        if (rutasRes.data?.success) setRutas(rutasRes.data.data || []);
      } catch (error) {
        console.error("Error cargando datos del mapa:", error);
      }
    };
    fetchData();
  }, []);

  const rutasConParadas = useMemo(() => {
    return rutas.map((ruta) => ({
      ...ruta,
      paradas: puntos
        .filter((p) => Number(p.ruta_id) === Number(ruta.id))
        .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0)),
    })).filter((ruta) => ruta.paradas.length > 0);
  }, [rutas, puntos]);

  useEffect(() => {
    if (rutasConParadas.length === 0) return;
    let cancelado = false;
    const cargarMetricasViales = async () => {
      setCargandoRutas(true);
      setErrorRouting(false);
      try {
        const resultados = await calcularMetricasRutas(rutasConParadas);
        if (cancelado) return;
        setGeometrias(resultados);
        if (onMetricasRuta) onMetricasRuta(resultados);
        if (rutasConParadas.length > 0 && Object.keys(resultados).length === 0) {
          setErrorRouting(true);
        }
      } catch (error) {
        console.error("Error calculando métricas viales:", error);
        if (!cancelado) {
          setGeometrias({});
          if (onMetricasRuta) onMetricasRuta({});
          setErrorRouting(true);
        }
      } finally {
        if (!cancelado) setCargandoRutas(false);
      }
    };
    cargarMetricasViales();
    return () => { cancelado = true; };
  }, [rutasConParadas, onMetricasRuta]);

  const seleccionarRuta = (ruta) => {
    if (rutaSeleccionada && Number(rutaSeleccionada.id) === Number(ruta.id)) {
      setRutaSeleccionada(null);
    } else {
      setRutaSeleccionada(ruta);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", overflow: "hidden", borderRadius: "inherit" }}>
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%", minHeight: "500px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />

        {/* Rutas con polylines */}
        {rutasConParadas.map((ruta) => {
          const geometria = geometrias[ruta.id];
          if (!geometria?.geometry?.length) return null;
          const activa = rutaSeleccionada && Number(rutaSeleccionada.id) === Number(ruta.id);
          return (
            <Polyline key={ruta.id} positions={geometria.geometry}
              pathOptions={{ color: ruta.color_hex || "#2563eb", weight: activa ? 9 : 5, opacity: activa ? 1 : 0.65 }} >
              <Tooltip sticky><strong>{ruta.nombre}</strong></Tooltip>
            </Polyline>
          );
        })}

        {/* Paradas como CircleMarker */}
        {rutasConParadas.map((ruta) => {
          const color = ruta.color_hex || "#2563eb";
          return ruta.paradas.map((parada) => (
            <CircleMarker
              key={parada.id}
              center={[Number(parada.latitud), Number(parada.longitud)]}
              radius={6}
              pathOptions={{ color, fillColor: color, fillOpacity: 1 }}
            >
              <Tooltip sticky>
                <strong>{parada.nombre}</strong>
              </Tooltip>
            </CircleMarker>
          ));
        })}

        {/* Zonas críticas */}
        {zonas.map((zona) => {
          const { color, fillColor, radius } = getZonaStyle(zona.nivel_congestion);
          return (
            <Circle key={zona.id} center={[Number(zona.latitud), Number(zona.longitud)]}
              radius={Number(zona.radio_metros) || radius}
              pathOptions={{ color, fillColor, fillOpacity: 0.18, weight: 3, dashArray: "8 8" }} />
          );
        })}
      </MapContainer>

      {mostrarSelectorRuta && (
        <div style={{ position: "absolute", top: "15px", left: "15px", zIndex: 1000, width: "280px", background: "#fff", borderRadius: "16px", padding: "14px", boxShadow: "0 8px 25px rgba(0,0,0,0.16)" }}>
          <div style={{ fontSize: "15px", fontWeight: "800", marginBottom: "10px" }}>🚌 Seleccionar ruta</div>
          {rutasConParadas.map((ruta) => {
            const activa = rutaSeleccionada && Number(rutaSeleccionada.id) === Number(ruta.id);
            const color = ruta.color_hex || "#2563eb";
            return (
              <button key={ruta.id} onClick={() => seleccionarRuta(ruta)}
                style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px", borderRadius: "10px", border: activa ? `2px solid ${color}` : "1px solid #e5e7eb", background: activa ? `${color}18` : "#fff" }}>
                <span style={{ width: "13px", height: "13px", borderRadius: "50%", background: color }} />
                <span style={{ flex: 1, fontWeight: activa ? "800" : "600" }}>{ruta.nombre}</span>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>{ruta.paradas.length} paradas</span>
              </button>
            );
          })}
          {rutaSeleccionada && (
            <button onClick={() => setRutaSeleccionada(null)} style={{ marginTop: "9px", padding: "8px", borderRadius: "9px", background: "#f3f4f6" }}>
              Ver todas las rutas
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function getZonaStyle(nivel) {
  switch (nivel) {
    case "alta": return { color: "#dc2626", fillColor: "#f87171", radius: 300 };
    case "media": return { color: "#f59e0b", fillColor: "#fcd34d", radius: 200 };
    case "baja": return { color: "#22c55e", fillColor: "#86efac", radius: 150 };
    default: return { color: "#6b7280", fillColor: "#d1d5db", radius: 100 };
  }
}
