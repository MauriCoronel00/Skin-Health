export interface ZonaEnvio {
  id: string;
  nombre: string;
  precioGs: number;
  permiteEfectivoContraEntrega: boolean;
  tiempoEstimado: string;
  barrios?: string[];
}

export const ZONAS_COBERTURA: Record<string, ZonaEnvio> = {
  ASUNCION: {
    id: 'ASUNCION',
    nombre: 'Asunción (Todos los barrios)',
    precioGs: 15000,
    permiteEfectivoContraEntrega: true,
    tiempoEstimado: 'Envíos en 24hs',
    barrios: [
      'Carmelitas',
      'Recoleta',
      'Villa Morra',
      'Murucoja',
      'Manora',
      'Centro',
      'Sajonia',
      'Las Lomas',
      'Mburucuyá',
      'San Cristóbal',
      'Trinidad',
      'SANTISIMA TRINIDAD',
      'Herrera',
      'Los Laureles',
      'Otro barrio de Asunción',
    ],
  },
  GRAN_ASU_CERCANO: {
    id: 'GRAN_ASU_CERCANO',
    nombre: 'Gran Asunción - Zona 1 (Lambaré, Fernando, Luque, San Lorenzo)',
    precioGs: 20000,
    permiteEfectivoContraEntrega: true,
    tiempoEstimado: '24 a 48hs',
    barrios: [
      'Lambaré',
      'Fernando de la Mora (Zona Norte/Sur)',
      'Luque',
      'San Lorenzo',
      'Mariano Roque Alonso',
    ],
  },
  GRAN_ASU_PERIFERICO: {
    id: 'GRAN_ASU_PERIFERICO',
    nombre: 'Gran Asunción - Zona 2 (Ñemby, Villa Elisa, Capiatá, Limpio)',
    precioGs: 25000,
    permiteEfectivoContraEntrega: true,
    tiempoEstimado: '24 a 48hs',
    barrios: ['Ñemby', 'Villa Elisa', 'Capiatá', 'Limpio', 'San Antonio'],
  },
  INTERIOR: {
    id: 'INTERIOR',
    nombre: 'Interior del País (Envío por Encomienda / Transportadora)',
    precioGs: 30000,
    permiteEfectivoContraEntrega: false,
    tiempoEstimado: '48 a 72hs (AEX / NSA / Transportadora)',
    barrios: [
      'Ciudad del Este',
      'Encarnación',
      'Coronel Oviedo',
      'Villarrica',
      'Concepción',
      'Otra ciudad del interior',
    ],
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
