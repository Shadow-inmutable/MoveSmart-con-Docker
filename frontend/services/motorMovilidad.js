const OSRM_BASE_URL =
  "https://router.project-osrm.org/route/v1/driving";

/**
 * Convierte un valor a número válido.
 */
function normalizarNumero(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : null;
}

/**
 * Obtiene la ruta vial real mediante OSRM
 * utilizando las paradas ordenadas de una ruta.
 */
export async function calcularRutaVial(ruta) {
  if (!ruta?.paradas || ruta.paradas.length < 2) {
    return null;
  }

  const coordenadas = ruta.paradas
    .map((parada) => {
      const lat = normalizarNumero(parada.latitud);
      const lng = normalizarNumero(parada.longitud);

      if (lat === null || lng === null) {
        return null;
      }

      return `${lng},${lat}`;
    })
    .filter(Boolean);

  if (coordenadas.length < 2) {
    return null;
  }

  const url =
    `${OSRM_BASE_URL}/` +
    `${coordenadas.join(";")}` +
    `?overview=full&geometries=geojson&steps=false`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `OSRM respondió con estado ${response.status}`
      );
    }

    const data = await response.json();

    if (
      data.code !== "Ok" ||
      !data.routes ||
      data.routes.length === 0
    ) {
      return null;
    }

    const rutaOSRM = data.routes[0];

    const geometry =
      rutaOSRM.geometry?.coordinates || [];

    const coordinates = geometry.map(
      ([lng, lat]) => [lat, lng]
    );

    const distanceKm =
      Number(rutaOSRM.distance || 0) / 1000;

    const durationMin =
      Number(rutaOSRM.duration || 0) / 60;

    return {
      rutaId: ruta.id,
      geometry: coordinates,

      distanceKm: Number(
        distanceKm.toFixed(2)
      ),

      durationMin: Number(
        durationMin.toFixed(1)
      ),
    };
  } catch (error) {
    console.error(
      `Error calculando ruta vial de ${ruta?.nombre}:`,
      error
    );

    return null;
  }
}

/**
 * Calcula las métricas viales de todas las rutas.
 */
export async function calcularMetricasRutas(rutas) {
  const resultados = {};

  for (const ruta of rutas || []) {
    const resultado =
      await calcularRutaVial(ruta);

    if (resultado) {
      resultados[ruta.id] = resultado;
    }
  }

  return resultados;
}

/**
 * Calcula la diferencia porcentual entre
 * una métrica base y una métrica vial.
 *
 * No representa optimización.
 * Solamente representa diferencia respecto
 * al valor almacenado en la ruta.
 */
export function calcularDiferenciaPorcentual(
  base,
  vial
) {
  const valorBase = Number(base);
  const valorVial = Number(vial);

  if (
    !Number.isFinite(valorBase) ||
    !Number.isFinite(valorVial) ||
    valorBase === 0
  ) {
    return null;
  }

  return Number(
    (
      ((valorVial - valorBase) /
        valorBase) *
      100
    ).toFixed(1)
  );
}

/**
 * Construye el conjunto de métricas
 * reutilizable por Dashboard, gráficas
 * y paneles.
 */
export function construirMetricasRuta(
  ruta,
  metricaVial
) {
  if (!ruta) {
    return null;
  }

  const distanciaBase =
    Number(ruta.distancia_km);

  const tiempoBase =
    Number(ruta.tiempo_estimado_min);

  const distanciaVial =
    Number(metricaVial?.distanceKm);

  const tiempoVial =
    Number(metricaVial?.durationMin);

  const distanciaBaseValida =
    Number.isFinite(distanciaBase)
      ? distanciaBase
      : null;

  const tiempoBaseValido =
    Number.isFinite(tiempoBase)
      ? tiempoBase
      : null;

  const distanciaVialValida =
    Number.isFinite(distanciaVial)
      ? distanciaVial
      : null;

  const tiempoVialValido =
    Number.isFinite(tiempoVial)
      ? tiempoVial
      : null;

  let diferenciaDistancia = null;

  if (
    distanciaBaseValida !== null &&
    distanciaVialValida !== null &&
    distanciaBaseValida !== 0
  ) {
    diferenciaDistancia =
      Number(
        (
          (
            (
              distanciaVialValida -
              distanciaBaseValida
            ) /
            distanciaBaseValida
          ) * 100
        ).toFixed(1)
      );
  }

  let diferenciaTiempo = null;

  if (
    tiempoBaseValido !== null &&
    tiempoVialValido !== null &&
    tiempoBaseValido !== 0
  ) {
    diferenciaTiempo =
      Number(
        (
          (
            (
              tiempoVialValido -
              tiempoBaseValido
            ) /
            tiempoBaseValido
          ) * 100
        ).toFixed(1)
      );
  }

  return {
    rutaId: ruta.id,

    ruta:
      ruta.nombre ||
      "Sin nombre",

    distanciaBase:
      distanciaBaseValida,

    distanciaVial:
      distanciaVialValida,

    tiempoBase:
      tiempoBaseValido,

    tiempoVial:
      tiempoVialValido,

    diferenciaDistancia,

    diferenciaTiempo,

    geometria:
      metricaVial?.geometry || [],
  };
}