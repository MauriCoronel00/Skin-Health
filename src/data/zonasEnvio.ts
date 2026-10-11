export interface ZonaEnvio {
  id: string;
  nombre: string;
  precioGs: number;
  permiteEfectivoContraEntrega: boolean;
  tiempoEstimado: string;
  barrios?: string[];
}

export const ZONAS_COBERTURA: Record<string, ZonaEnvio> = {
  LUQUE: {
    id: 'LUQUE',
    nombre: 'Luque (Todos los barrios)',
    precioGs: 15000,
    permiteEfectivoContraEntrega: true,
    tiempoEstimado: 'Envíos en el día',
  },
  GRAN_ASU_CERCANO: {
    id: 'GRAN_ASU_CERCANO',
    nombre: 'Zona 1 (San Lorenzo, Fernando, Villamorra, Carmelitas)',
    precioGs: 30000,
    permiteEfectivoContraEntrega: true,
    tiempoEstimado: '24hs',
  },
  GRAN_ASU_PERIFERICO: {
    id: 'GRAN_ASU_PERIFERICO',
    nombre: 'Zona 2 (Asunción Centro, Lambaré, Ñemby, Limpio)',
    precioGs: 40000,
    permiteEfectivoContraEntrega: true,
    tiempoEstimado: '24 a 48hs',
  },
  INTERIOR: {
    id: 'INTERIOR',
    nombre: 'Interior del País (Encomienda / Transportadora)',
    precioGs: 35000,
    permiteEfectivoContraEntrega: false,
    tiempoEstimado: '48 a 72hs',
  },
};

export type MetodoPagoId = 'TRANSFERENCIA' | 'USDT' | 'EFECTIVO';

export interface MetodoPago {
  id: MetodoPagoId;
  label: string;
  requierePagoPrevio: boolean;
}

export const METODOS_PAGO: MetodoPago[] = [
  { id: 'TRANSFERENCIA', label: 'Transferencia Bancaria (SIPAAP)', requierePagoPrevio: true },
  { id: 'USDT', label: 'USDT (Crypto)', requierePagoPrevio: true },
  { id: 'EFECTIVO', label: 'Efectivo contra entrega', requierePagoPrevio: false },
];
