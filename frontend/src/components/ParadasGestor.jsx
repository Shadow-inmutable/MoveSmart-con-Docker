import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/api";

export default function ParadasGestor({ rutaId = null }) {
  const [paradas, setParadas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ========================================
  // CARGAR RUTAS Y PARADAS
  // ========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paradasRes, rutasRes] = await Promise.all([
          api.get("/rutas/paradas"),
          api.get("/rutas"),
        ]);

        if (paradasRes.data?.success) {
          setParadas(paradasRes.data.data || []);
        }

        if (rutasRes.data?.success) {
          setRutas(rutasRes.data.data || []);
        }
      } catch (error) {
        console.error("Error cargando información de rutas y paradas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ========================================
  // MAPA DE RUTAS
  // ========================================

  const rutasMap = useMemo(() => {
    return new Map(
      rutas.map((ruta) => [ruta.id, ruta])
    );
  }, [rutas]);

  // ========================================
  // PARADAS VISIBLES
  // ========================================

  const paradasVisibles = useMemo(() => {
    let resultado = [...paradas];

    // Si existe una ruta seleccionada,
    // mostramos únicamente sus paradas.
    if (rutaId) {
      resultado = resultado.filter(
        (parada) => Number(parada.ruta_id) === Number(rutaId)
      );
    }

    // Orden lógico:
    // primero ruta y después orden de parada.
    return resultado.sort((a, b) => {
      if (a.ruta_id !== b.ruta_id) {
        return Number(a.ruta_id) - Number(b.ruta_id);
      }

      return Number(a.orden) - Number(b.orden);
    });
  }, [paradas, rutaId]);

  // ========================================
  // RUTA SELECCIONADA
  // ========================================

  const rutaActual = rutaId
    ? rutasMap.get(Number(rutaId))
    : null;

  // ========================================
  // ESTADO DE CARGA
  // ========================================

  if (loading) {
    return (
      <div style={loadingStyle}>
        <span>🚏 Cargando paradas...</span>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div style={containerStyle}>

      {/* ========================================
          ENCABEZADO
      ======================================== */}

      <div style={headerStyle}>

        <div>
          <div style={titleStyle}>
            🚏 Paradas de la ruta
          </div>

          {rutaActual ? (
            <div style={subtitleStyle}>
              <span
                style={{
                  ...routeDotStyle,
                  backgroundColor:
                    rutaActual.color_hex || "#4318ff",
                }}
              />

              {rutaActual.nombre}

              <span style={countBadgeStyle}>
                {paradasVisibles.length}{" "}
                {paradasVisibles.length === 1
                  ? "parada"
                  : "paradas"}
              </span>
            </div>
          ) : (
            <div style={subtitleStyle}>
              Todas las paradas registradas
            </div>
          )}
        </div>

        {/* ========================================
            BOTÓN DE GESTIÓN
        ======================================== */}

        <button
          onClick={() => navigate("/paradas")}
          style={manageButtonStyle}
          title="Abrir módulo de gestión de paradas"
        >
          ⚙️ Gestionar
        </button>

      </div>

      {/* ========================================
          RESUMEN DE RUTA
      ======================================== */}

      {rutaActual && (
        <div style={routeSummaryStyle}>

          <div>
            <span style={summaryLabelStyle}>
              Distancia
            </span>

            <strong>
              {Number(rutaActual.distancia_km || 0).toFixed(2)} km
            </strong>
          </div>

          <div>
            <span style={summaryLabelStyle}>
              Tiempo estimado
            </span>

            <strong>
              {rutaActual.tiempo_estimado_min || 0} min
            </strong>
          </div>

          <div>
            <span style={summaryLabelStyle}>
              Paradas
            </span>

            <strong>
              {paradasVisibles.length}
            </strong>
          </div>

        </div>
      )}

      {/* ========================================
          TABLA
      ======================================== */}

      {paradasVisibles.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: "28px" }}>
            🚏
          </div>

          <strong>
            No hay paradas disponibles
          </strong>

          <span>
            {rutaActual
              ? "Esta ruta todavía no tiene paradas registradas."
              : "No se encontraron paradas registradas en el sistema."}
          </span>
        </div>
      ) : (
        <div style={tableWrapperStyle}>

          <table style={tableStyle}>

            <thead>
              <tr>
                <th style={thStyle}>Orden</th>
                <th style={thStyle}>Parada</th>
                {!rutaId && (
                  <th style={thStyle}>Ruta</th>
                )}
                <th style={thStyle}>Ubicación</th>
              </tr>
            </thead>

            <tbody>
              {paradasVisibles.map((parada) => {

                const ruta = rutasMap.get(
                  Number(parada.ruta_id)
                );

                const routeColor =
                  ruta?.color_hex || "#4318ff";

                return (
                  <tr
                    key={parada.id}
                    style={rowStyle}
                  >

                    {/* ORDEN */}

                    <td style={tdOrderStyle}>
                      <span
                        style={{
                          ...orderBadgeStyle,
                          borderColor: routeColor,
                          color: routeColor,
                        }}
                      >
                        {parada.orden}
                      </span>
                    </td>

                    {/* NOMBRE */}

                    <td style={tdNameStyle}>

                      <div style={stopNameWrapperStyle}>

                        <span
                          style={{
                            ...stopIndicatorStyle,
                            backgroundColor: routeColor,
                          }}
                        />

                        <div>
                          <strong style={stopNameStyle}>
                            {parada.nombre}
                          </strong>

                          <div style={stopIdStyle}>
                            ID parada: {parada.id}
                          </div>
                        </div>

                      </div>

                    </td>

                    {/* RUTA */}

                    {!rutaId && (
                      <td style={tdStyle}>

                        <div style={routeNameWrapperStyle}>

                          <span
                            style={{
                              ...routeColorDotStyle,
                              backgroundColor: routeColor,
                            }}
                          />

                          <span>
                            {ruta?.nombre || `Ruta ${parada.ruta_id}`}
                          </span>

                        </div>

                      </td>
                    )}

                    {/* COORDENADAS */}

                    <td style={tdCoordinatesStyle}>

                      <span>
                        {Number(parada.latitud).toFixed(6)}
                      </span>

                      <span style={coordinateSeparator}>
                        ,
                      </span>

                      <span>
                        {Number(parada.longitud).toFixed(6)}
                      </span>

                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

/* =====================================================
   🎨 ESTILOS
===================================================== */

const containerStyle = {
  width: "100%",
  minWidth: 0,
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "14px",
};

const titleStyle = {
  color: "#2B3674",
  fontSize: "17px",
  fontWeight: "800",
  marginBottom: "5px",
};

const subtitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#718096",
  fontSize: "12px",
};

const routeDotStyle = {
  width: "9px",
  height: "9px",
  borderRadius: "50%",
  display: "inline-block",
};

const countBadgeStyle = {
  marginLeft: "6px",
  padding: "3px 8px",
  borderRadius: "999px",
  background: "#EEF2FF",
  color: "#4338CA",
  fontSize: "11px",
  fontWeight: "700",
};

const manageButtonStyle = {
  border: "none",
  borderRadius: "10px",
  padding: "8px 12px",
  background: "#2B3674",
  color: "white",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const routeSummaryStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "12px",
  background: "#F7F9FC",
  border: "1px solid #E6EAF2",
};

const summaryLabelStyle = {
  display: "block",
  color: "#8A94A6",
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  marginBottom: "3px",
};

const tableWrapperStyle = {
  width: "100%",
  maxHeight: "330px",
  overflow: "auto",
  border: "1px solid #E6EAF2",
  borderRadius: "14px",
  background: "#FFFFFF",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: "12px",
};

const thStyle = {
  position: "sticky",
  top: 0,
  zIndex: 2,
  padding: "10px 8px",
  background: "#F3F6FB",
  color: "#52607A",
  fontSize: "10px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  textAlign: "left",
  borderBottom: "1px solid #E1E6EF",
};

const rowStyle = {
  transition: "background-color 0.2s ease",
};

const tdStyle = {
  padding: "10px 8px",
  color: "#475569",
  borderBottom: "1px solid #EEF1F5",
  verticalAlign: "middle",
};

const tdOrderStyle = {
  ...tdStyle,
  width: "60px",
  textAlign: "center",
};

const tdNameStyle = {
  ...tdStyle,
  minWidth: "150px",
};

const tdCoordinatesStyle = {
  ...tdStyle,
  whiteSpace: "nowrap",
  color: "#64748B",
  fontFamily: "monospace",
  fontSize: "11px",
};

const orderBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "27px",
  height: "27px",
  borderRadius: "50%",
  border: "2px solid",
  background: "#FFFFFF",
  fontWeight: "800",
};

const stopNameWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const stopIndicatorStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  flexShrink: 0,
};

const stopNameStyle = {
  color: "#26345D",
  fontSize: "12px",
};

const stopIdStyle = {
  marginTop: "2px",
  color: "#9AA4B2",
  fontSize: "9px",
};

const routeNameWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const routeColorDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  flexShrink: 0,
};

const coordinateSeparator = {
  margin: "0 3px",
  color: "#CBD5E1",
};

const emptyStateStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  minHeight: "180px",
  padding: "20px",
  textAlign: "center",
  border: "1px dashed #CBD5E1",
  borderRadius: "14px",
  background: "#F8FAFC",
  color: "#64748B",
  fontSize: "12px",
};

const loadingStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "150px",
  color: "#64748B",
  fontSize: "13px",
};