import { SkincareRoutine } from '../types';

export const SKINCARE_ROUTINES: SkincareRoutine[] = [
  {
    id: 'piel-grasa',
    number: '01',
    title: 'Rutina para Piel Grasa y Tendencia al Acné',
    goal: 'Control de sebo + apariencia de poros + limpieza profunda + protección solar',
    steps: [
      {
        stepNumber: 1,
        label: 'Limpieza Purificante',
        productId: 'cerave-sa-smoothing-cleanser',
        alternativeProductIds: ['cerave-foaming-facial-cleanser', 'laroche-effaclar-gel'],
        note: 'CeraVe SA Smoothing, Foaming o Effaclar Gel',
      },
      {
        stepNumber: 2,
        label: 'Tratamiento Sebo & Poros',
        productId: 'ordinary-niacinamide-zinc',
        alternativeProductIds: ['ordinary-salicylic-acid-solution'],
        note: 'Niacinamide 10% + Zinc 1% o Salicylic Acid 2%',
      },
      {
        stepNumber: 3,
        label: 'Acondicionamiento',
        productId: 'centella-poremizing-ampoule',
        note: 'Poremizing con sal rosa del Himalaya',
      },
      {
        stepNumber: 4,
        label: 'Protección Solar',
        productId: 'laroche-anthelios-oil-control',
        note: 'FPS 50+ toque seco matificante 12h',
      },
    ],
    instructionType: 'ORDEN',
    instructionText:
      'ORDEN: Limpieza profunda previa, aplicar sérums de menor a mayor densidad y finalizar la rutina de mañana con el protector solar.',
  },
  {
    id: 'hidratacion-sensible',
    number: '02',
    title: 'Rutina para Piel Sensible y Barrera Cutánea',
    goal: 'Calma + hidratación + apoyo de la barrera cutánea',
    steps: [
      {
        stepNumber: 1,
        label: 'Limpieza Reconfortante',
        productId: 'cerave-hydrating-facial-cleanser',
        note: 'Limpiador cremoso sin tirantez con ceramidas',
      },
      {
        stepNumber: 2,
        label: 'Calmante Intensivo',
        productId: 'madagascar-centella-ampoule',
        note: '100% extracto puro de Centella de Madagascar',
      },
      {
        stepNumber: 3,
        label: 'Reparación de Barrera',
        productId: 'laroche-cicaplast-baume',
        alternativeProductIds: ['cerave-daily-moisturizing-lotion'],
        note: 'Cicaplast Baume (zonas/noche) o Daily Lotion (diario)',
      },
      {
        stepNumber: 4,
        label: 'Protección Solar',
        productId: 'centella-hyalu-cica-sun-serum',
        note: 'FPS 50+ hidratante acabado glow ligero',
      },
    ],
    instructionType: 'IMPORTANTE',
    instructionText:
      'IMPORTANTE: Si Cicaplast se utiliza durante el día, el protector solar debe quedar como último paso. La rutina puede ajustarse según la necesidad de hidratación y confort.',
  },
  {
    id: 'manchas-luminosidad',
    number: '03',
    title: 'Rutina para Manchas, Hiperpigmentación y Luminosidad',
    goal: 'Vitamina C + exfoliación química + tono unificado + protección solar',
    steps: [
      {
        stepNumber: 1,
        label: 'Limpieza Suave',
        productId: 'ordinary-squalane-cleanser',
        note: 'Bálsamo a aceite que cuida la barrera cutánea',
      },
      {
        stepNumber: 2,
        label: 'Tratamiento Luminosidad',
        productId: 'laroche-vitaminc10',
        alternativeProductIds: ['ordinary-alpha-arbutin-ha', 'ordinary-glycolic-acid-toner'],
        note: 'Día: Vitamina C10 o Alpha Arbutin | Noche: Glicólico 7%',
      },
      {
        stepNumber: 3,
        label: 'Protección Solar',
        productId: 'laroche-anthelios-oil-control',
        alternativeProductIds: ['centella-hyalu-cica-sun-serum'],
        note: 'Anthelios Oil Control o Centella Hyalu-Cica',
      },
    ],
    instructionType: 'IMPORTANTE',
    instructionText:
      'IMPORTANTE: No es necesario usar vitamina C y ácido glicólico en la misma aplicación. El glicólico se puede reservar para la noche (2 a 3 veces por semana); durante el día, usar protector solar.',
  },
  {
    id: 'anti-edad-renovacion',
    number: '04',
    title: 'Rutina Anti-Edad y Textura (Renovación)',
    goal: 'Líneas finas, firmeza, descongestión ocular y renovación celular',
    steps: [
      {
        stepNumber: 1,
        label: 'Limpieza Suave',
        productId: 'cerave-hydrating-facial-cleanser',
        note: 'Limpieza suave sin alterar lípidos',
      },
      {
        stepNumber: 2,
        label: 'Contorno de Ojos',
        productId: 'ordinary-caffeine-solution',
        note: 'Reduce bolsas, ojeras y fatiga periocular',
      },
      {
        stepNumber: 3,
        label: 'Tratamiento Renovador',
        productId: 'cerave-resurfacing-retinol-serum',
        note: 'Retinol encapsulado y regaliz (uso nocturno)',
      },
      {
        stepNumber: 4,
        label: 'Nutrición Intensiva',
        productId: 'cerave-moisturizing-cream',
        note: 'Crema rica restauradora con 3 ceramidas',
      },
    ],
    instructionType: 'IMPORTANTE',
    instructionText:
      'IMPORTANTE: El sérum con Retinol debe incorporarse progresivamente por las noches. Durante el día es indispensable aplicar protector solar de amplio espectro.',
  },
  {
    id: 'hidratacion-universal',
    number: '05',
    title: 'Rutina Básica de Hidratación Universal',
    goal: 'Hidratación multicapa esencial y balanceada para todo tipo de piel',
    steps: [
      {
        stepNumber: 1,
        label: 'Limpieza Equilibrada',
        productId: 'cerave-foaming-facial-cleanser',
        alternativeProductIds: ['cerave-hydrating-facial-cleanser'],
        note: 'Foaming (piel mixta/grasa) o Hydrating (piel seca)',
      },
      {
        stepNumber: 2,
        label: 'Sérum Hidratante',
        productId: 'ordinary-hyaluronic-acid',
        note: 'Ácido Hialurónico 2% + B5 multicapa',
      },
      {
        stepNumber: 3,
        label: 'Sellado Hidratante',
        productId: 'cerave-daily-moisturizing-lotion',
        note: 'Loción hidratante ligera de liberación prolongada',
      },
      {
        stepNumber: 4,
        label: 'Protección Solar',
        productId: 'centella-hyalu-cica-sun-serum',
        note: 'FPS 50+ acabado natural hidratado',
      },
    ],
    instructionType: 'ORDEN',
    instructionText:
      'ORDEN: Aplicar el sérum de Ácido Hialurónico sobre la piel ligeramente húmeda antes de la loción hidratante para maximizar la retención de agua.',
  },
];
