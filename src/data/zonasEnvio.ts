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
      'Bañado Cará Cará',
      'Bañado Santa Ana',
      'Bañado Tacumbú',
      'Banco San Miguel',
      'Barrio Obrero',
      'Bella Vista',
      'Botánico',
      'Cañada del Ybyray',
      'Carlos A. López',
      'Catedral',
      'Ciudad Nueva',
      'Dr. Francia',
      'Dr. Roberto L. Pettit',
      'General Caballero',
      'General Díaz',
      'Herrera',
      'Hipódromo',
      'Itá Enramada',
      'Itá Pytã Punta',
      'Jara',
      'Jukyty',
      'La Encarnación',
      'Las Lomas (Carmelitas)',
      'Las Mercedes',
      'Loma Pytá',
      'Los Laureles',
      'Madame Elisa Alicia Lynch',
      'Manorá',
      'Mariscal Estigarribia',
      'Mariscal López',
      'Mbocayaty',
      'Mburicaó',
      'Mburucuyá',
      'Nazareth',
      'Ñu Guazú',
      'Panambí Retá',
      'Panambí Verá',
      'Pettirossi',
      'Pinozá',
      'Recoleta',
      'Republicano',
      'Ricardo Brugada (Chacarita)',
      'Sajonia',
      'Salvador del Mundo',
      'San Antonio',
      'San Blas',
      'San Cayetano',
      'San Cristóbal',
      'San Jorge',
      'San José',
      'San Juan',
      'San Pablo',
      'San Roque',
      'San Vicente',
      'Santa Ana',
      'Santa Librada',
      'Santa María',
      'Santa Rosa',
      'Santísima Trinidad',
      'Santo Domingo',
      'Tablada Nueva',
      'Tacumbú',
      'Tembetary',
      'Terminal',
      'Villa Aurelia',
      'Villa Morra',
      'Virgen de Fátima',
      'Virgen de la Asunción',
      'Virgen del Huerto',
      'Vista Alegre',
      'Ycuá Satí',
      'Ytay',
      'Zeballos Cué',
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
