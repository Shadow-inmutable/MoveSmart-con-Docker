import React, {
  useState,
  useEffect,
} from "react";

import Sidebar from "../components/Sidebar";
import MapaLeaflet from "../components/MapaLeaflet";
import MetricasOptimizacion from "../components/MetricasOptimizacion";
import GraficaEficiencia from "../components/GraficaEficiencia";
import GraficaDistancia from "../components/GraficaDistancia";
import GraficaComparacion from "../components/GraficaComparacion";
import ParadasGestor from "../components/ParadasGestor";
import UsuariosForm from "../components/UsuariosForm";

import api from "../api/api";

import {
  construirMetricasRuta,
} from "../../services/motorMovilidad";

export default function Dashboard() {
  const [
    rutaSeleccionada,
    setRutaSeleccionada,
  ] = useState(null);

  const [rutas, setRutas] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /*
   * ============================================================
   * MÉTRICAS VIALES CALCULADAS POR EL MOTOR
   * ============================================================
   *
   * Esta información llega desde MapaLeaflet mediante:
   *
   * onMetricasRuta={setMetricasViales}
   *
   * Estructura esperada:
   *
   * {
   *   1: {
   *     rutaId: 1,
   *     geometry: [...],
   *     distanceKm: 8.42,
   *     durationMin: 24.7
   *   },
   *
   *   2: {
   *     rutaId: 2,
   *     geometry: [...],
   *     distanceKm: 6.91,
   *     durationMin: 21.3
   *   }
   * }
   */
  const [
    metricasViales,
    setMetricasViales,
  ] = useState({});

  /*
   * ============================================================
   * USUARIO ACTUAL
   * ============================================================
   */

  let usuario = null;

  try {
    usuario = JSON.parse(
      localStorage.getItem("user")
    );
  } catch {
    usuario = null;
  }

  const esAdmin =
    usuario?.rol?.toLowerCase() ===
    "admin";

  /*
   * ============================================================
   * CARGAR RUTAS
   * ============================================================
   */

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const res = await api.get(
          "/rutas"
        );

        setRutas(
          res.data?.data || []
        );
      } catch (error) {
        console.error(
          "Error cargando rutas:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRutas();
  }, []);

  /*
   * ============================================================
   * RUTAS VISIBLES
   * ============================================================
   *
   * Si el usuario selecciona una ruta:
   *
   *   Dashboard → solamente esa ruta
   *
   * Si no selecciona ninguna:
   *
   *   Dashboard → todas las rutas
   */

  const rutasBase =
    rutaSeleccionada
      ? [rutaSeleccionada]
      : rutas;

  /*
   * ============================================================
   * DATOS PARA LAS GRÁFICAS
   * ============================================================
   *
   * IMPORTANTE:
   *
   * Ya NO existe:
   *
   *   tiempo_opt
   *
   * Ya NO hacemos:
   *
   *   tiempo * 0.8
   *   tiempo * 0.85
   *
   * Porque todavía no existe una ruta alternativa real.
   *
   * Actualmente comparamos:
   *
   *   BASE
   *      ↓
   *   dato registrado en BD
   *
   *   VIAL
   *      ↓
   *   recorrido real calculado mediante OSRM
   */

  const dataGraficas =
    rutasBase.map((ruta) => {
      const metricaVial =
        metricasViales[ruta.id];

      const metricas =
        construirMetricasRuta(
          ruta,
          metricaVial
        );

      return {
        /*
         * Identificación
         */
        ruta:
          metricas?.ruta ||
          ruta?.nombre ||
          "Sin nombre",

        /*
         * ======================================================
         * DISTANCIA
         * ======================================================
         */

        distancia_base:
          metricas?.distanciaBase ?? 0,

        distancia_vial:
          metricas?.distanciaVial ?? 0,

        /*
         * ======================================================
         * TIEMPO
         * ======================================================
         */

        tiempo_base:
          metricas?.tiempoBase ?? 0,

        tiempo_vial:
          metricas?.tiempoVial ?? 0,

        /*
         * ======================================================
         * DIFERENCIAS
         * ======================================================
         *
         * Estas diferencias NO representan optimización.
         *
         * Representan únicamente la diferencia entre:
         *
         * dato registrado
         *        vs
         * recorrido vial OSRM
         */

        diferencia_distancia:
          metricas?.diferenciaDistancia ?? null,

        diferencia_tiempo:
          metricas?.diferenciaTiempo ?? null,

        /*
         * ======================================================
         * EFICIENCIA
         * ======================================================
         *
         * Por ahora conservamos el valor existente
         * en la base de datos.
         *
         * Todavía NO se calcula una nueva eficiencia.
         */

        eficiencia:
          Number(
            ruta?.eficiencia_porcentaje
          ) || 0,
      };
    });

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div style={loadingStyle}>
        🚀 Sincronizando Sistema Central...
      </div>
    );
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div style={layoutStyle}>

      <Sidebar
        onRutaSelect={
          setRutaSeleccionada
        }
      />

      <main style={mainContentStyle}>

        {/* ====================================================
            ENCABEZADO
            ==================================================== */}

        <header style={headerStyle}>
          <div>

            <h1 style={titleStyle}>
              Move Smart{" "}
              <span
                style={{
                  fontWeight: 300,
                }}
              >
                | Gestión Estratégica
              </span>
            </h1>

            <p style={subtitleStyle}>
              Panel de control de movilidad
              urbana Manizales
            </p>

          </div>
        </header>

        {/* ====================================================
            BLOQUE SUPERIOR
            ==================================================== */}

        <section style={gridTop}>

          {/* ==================================================
              MAPA
              ================================================== */}

          <div
            style={{
              ...cardStyle,
              padding: 0,
              overflow: "hidden",
              position: "relative",
              minHeight: "500px",
            }}
          >

            <MapaLeaflet
              rutaSeleccionada={
                rutaSeleccionada
              }

              mostrarSelectorRuta={false}

              /*
               * El mapa ejecuta el motor de movilidad
               * y devuelve las métricas al Dashboard.
               */
              onMetricasRuta={
                setMetricasViales
              }
            />

            <div style={mapOverlay}>

              <MetricasOptimizacion
                rutaSeleccionada={
                  rutaSeleccionada
                }

                metricasRuta={
                  rutaSeleccionada
                    ? metricasViales[
                        rutaSeleccionada.id
                      ]
                    : null
                }
              />

            </div>

          </div>

          {/* ==================================================
              PARADAS
              ================================================== */}

          <div
            style={{
              ...cardStyle,
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              minHeight: "500px",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >

              <ParadasGestor
                rutaId={
                  rutaSeleccionada?.id
                }
              />

            </div>

          </div>

        </section>

        {/* ====================================================
            BLOQUE INFERIOR
            ==================================================== */}

        <section
          style={
            esAdmin
              ? gridBottomAdmin
              : gridBottomGestor
          }
        >

          {/* ==================================================
              CONTROL DE PERSONAL
              SOLO ADMIN
              ================================================== */}

          {esAdmin && (
            <div
              style={
                usuariosCardWrapper
              }
            >
              <UsuariosForm />
            </div>
          )}

          {/* ==================================================
              RENDIMIENTO
              ================================================== */}

          <div
            style={
              rendimientoCardStyle
            }
          >

            <div
              style={
                performanceHeader
              }
            >

              <div>

                <h3
                  style={
                    sectionTitleSmall
                  }
                >
                  📉 Rendimiento y
                  Eficiencia
                </h3>

                <p
                  style={
                    performanceSubtitle
                  }
                >
                  Comparación de datos
                  registrados y métricas
                  viales reales
                </p>

              </div>

            </div>

            <div
              style={
                chartGridCompact
              }
            >

              {/* =================================================
                  EFICIENCIA
                  ================================================= */}

              <div style={chartBox}>
                <GraficaEficiencia
                  data={dataGraficas}
                />
              </div>

              {/* =================================================
                  TIEMPO
                  ================================================= */}

              <div style={chartBox}>
                <GraficaComparacion
                  data={dataGraficas}
                />
              </div>

              {/* =================================================
                  DISTANCIA
                  ================================================= */}

              <div style={chartBox}>
                <GraficaDistancia
                  data={dataGraficas}
                />
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

/* ============================================================
   LAYOUT PRINCIPAL
   ============================================================ */

const layoutStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#F4F7FE",
  overflow: "hidden",
};

const mainContentStyle = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  overflowX: "hidden",
  padding: "24px",
  gap: "20px",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  marginBottom: "2px",
};

const titleStyle = {
  color: "#2B3674",
  fontSize: "24px",
  fontWeight: "800",
  margin: 0,
  lineHeight: 1.2,
};

const subtitleStyle = {
  color: "#A3AED0",
  fontSize: "13px",
  margin: "6px 0 0 0",
};

/* ============================================================
   TARJETAS
   ============================================================ */

const cardStyle = {
  background: "#FFFFFF",
  borderRadius: "20px",
  boxShadow:
    "0 10px 30px rgba(112, 144, 176, 0.08)",
  border: "1px solid #E0E5F2",
  boxSizing: "border-box",
};

const gridTop = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 2.15fr) minmax(320px, 1fr)",
  gap: "20px",
  minHeight: "500px",
};

const gridBottomAdmin = {
  display: "grid",
  gridTemplateColumns:
    "minmax(360px, 0.9fr) minmax(0, 1.8fr)",
  gap: "20px",
  alignItems: "stretch",
  minWidth: 0,
};

const gridBottomGestor = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr)",
  gap: "20px",
  minWidth: 0,
};

/* ============================================================
   MAPA
   ============================================================ */

const mapOverlay = {
  position: "absolute",
  top: "18px",
  right: "18px",
  zIndex: 1000,
  width: "220px",
  maxWidth: "calc(100% - 36px)",
};

/* ============================================================
   CONTROL DE PERSONAL
   ============================================================ */

const usuariosCardWrapper = {
  minWidth: 0,
  minHeight: "430px",
  maxHeight: "520px",
  overflow: "hidden",
  borderRadius: "20px",
  boxSizing: "border-box",
};

/* ============================================================
   RENDIMIENTO
   ============================================================ */

const rendimientoCardStyle = {
  ...cardStyle,
  minWidth: 0,
  minHeight: "430px",
  padding: "20px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
};

const performanceHeader = {
  flexShrink: 0,
  marginBottom: "12px",
};

const sectionTitleSmall = {
  color: "#2B3674",
  fontSize: "17px",
  fontWeight: "800",
  margin: 0,
};

const performanceSubtitle = {
  color: "#A3AED0",
  fontSize: "12px",
  margin: "5px 0 0 0",
};

/* ============================================================
   GRÁFICAS
   ============================================================ */

const chartGridCompact = {
  flex: 1,
  minHeight: 0,
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "12px",
};

const chartBox = {
  minWidth: 0,
  minHeight: "330px",
  height: "330px",
  padding: "12px",
  background: "#F8FAFD",
  border: "1px solid #EDF1F7",
  borderRadius: "14px",
  boxSizing: "border-box",
  overflow: "hidden",
};

/* ============================================================
   LOADING
   ============================================================ */

const loadingStyle = {
  display: "flex",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  color: "#2B3674",
  background: "#F4F7FE",
};