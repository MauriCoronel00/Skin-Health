/** Tarifa de delivery: base 8.000 Gs (primeros 3 km) + 2.000 Gs por km adicional. */
export const ENVIO_BASE_GS = 8000;
export const ENVIO_KM_BASE = 3;
export const ENVIO_EXTRA_POR_KM_GS = 2000;
export const ENVIO_MAX_GS = 200000;
/** Punto de partida del delivery (lo ve el cliente para calcular su distancia). */
export const ENVIO_ORIGEN = 'Nuestro local';
export const ENVIO_ORIGEN_MAPS_URL = 'https://maps.app.goo.gl/zrNpMzAYC9oZBLLh8';

/** Costo de envío en Gs para una distancia en km. Null si la distancia es inválida. */
export function calcularEnvio(distKm: number | null | undefined): number | null {
  if (distKm === null || distKm === undefined || !Number.isFinite(distKm) || distKm < 0) {
    return null;
  }
  const km = Math.min(Math.ceil(distKm), 200);
  if (km <= ENVIO_KM_BASE) return ENVIO_BASE_GS;
  return Math.min(ENVIO_BASE_GS + (km - ENVIO_KM_BASE) * ENVIO_EXTRA_POR_KM_GS, ENVIO_MAX_GS);
}
