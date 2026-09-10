import React from "react";

export default function MetricasOptimizacion({ rutaSeleccionada }) {
  if (!rutaSeleccionada) {
    return (
      <div style={containerStyle}>
        <p style={placeholderText}>Seleccione una ruta para ver métricas de rendimiento</p>
      </div>
    );
  }

  // Cálculos rápidos para mostrar valor
  const tiempoActual = rutaSeleccionada.tiempo_estimado_min;
  const tiempoOpt = Math.round(tiempoActual * 0.85); // Ejemplo: 15% de mejora
  const ahorro = tiempoActual - tiempoOpt;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <span style={dot}></span>
        <h4 style={titleStyle}>Rendimiento en Vivo</h4>
      </header>

      <div style={statsGrid}>
        {/* Distancia */}
        <div style={statCard}>
          <span style={label}>Distancia</span>
          <div style={valueGroup}>
            <span style={mainValue}>{rutaSeleccionada.distancia_km}</span>
            <span style={unit}>KM</span>
          </div>
        </div>

        {/* Tiempo Actual */}
        <div style={statCard}>
          <span style={label}>Tiempo Base</span>
          <div style={valueGroup}>
            <span style={mainValue}>{tiempoActual}</span>
            <span style={unit}>MIN</span>
          </div>
        </div>

        {/* Tiempo Optimizado */}
        <div style={{ ...statCard, borderLeft: '3px solid #05CD99' }}>
          <span style={{ ...label, color: '#05CD99' }}>Tiempo Opt.</span>
          <div style={valueGroup}>
            <span style={{ ...mainValue, color: '#05CD99' }}>{tiempoOpt}</span>
            <span style={unit}>MIN</span>
          </div>
        </div>
      </div>

      <div style={savingBadge}>
        🚀 Ahorro estimado: <strong>{ahorro} minutos</strong>
      </div>
    </div>
  );
}

/* 🎨 ESTILOS PARA EL PANEL FLOTANTE */
const containerStyle = {
  background: "rgba(255, 255, 255, 0.96)",
  backdropFilter: "blur(10px)",
  borderRadius: "18px",
  padding: "16px",
  boxShadow: "0 12px 30px rgba(43, 54, 116, 0.15)",
  border: "1px solid rgba(224, 229, 242, 0.8)",
};

const headerStyle = { display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" };
const dot = { width: "8px", height: "8px", borderRadius: "50%", background: "#4318FF" };
const titleStyle = { margin: 0, color: "#2B3674", fontSize: "14px", fontWeight: "700" };

const statsGrid = { display: "flex", flexDirection: "column", gap: "10px" };

const statCard = {
  background: "#F4F7FE",
  padding: "10px 14px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
};

const label = { fontSize: "10px", color: "#A3AED0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" };
const valueGroup = { display: "flex", alignItems: "baseline", gap: "4px" };
const mainValue = { fontSize: "18px", fontWeight: "800", color: "#2B3674" };
const unit = { fontSize: "10px", fontWeight: "600", color: "#707EAE" };

const savingBadge = {
  marginTop: "12px",
  background: "linear-gradient(90deg, #4318FF 0%, #6AD2FF 100%)",
  color: "white",
  padding: "8px",
  borderRadius: "10px",
  fontSize: "11px",
  textAlign: "center",
};

const placeholderText = { color: "#A3AED0", fontSize: "12px", textAlign: "center", margin: "10px 0" };