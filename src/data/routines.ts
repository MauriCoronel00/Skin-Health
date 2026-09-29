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
        productId: 'cosrx-lowph-good-morning-gel',
        alternativeProductIds: ['anua-heartleaf-cleansing-oil', 'cosrx-salicylic-gentle-cleanser'],
        note: 'Gel Low pH, Cleansing Oil Heartleaf o Salicylic para acné',
      },
      {
        stepNumber: 2,
        label: 'Tratamiento Sebo & Poros',
        productId: 'boj-glow-serum-propolis',
        alternativeProductIds: ['centella-poremizing-ampoule'],
        note: 'Glow Serum con Niacinamida o Ampolla Poremizing para poros',
      },
      {
        stepNumber: 3,
        label: 'Acondicionamiento',
        productId: 'anua-heartleaf-77-toner',
        note: 'Tónico calmante Heartleaf 77',
      },
      {
        stepNumber: 4,
        label: 'Protección Solar',
        productId: 'boj-relief-sun-rice',
        alternativeProductIds: ['centella-hyalu-cica-sun-serum'],
        note: 'Relief Sun Rice SPF50+ o Hyalu-Cica',
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
        productId: 'boj-radiance-cleansing-balm',
        note: 'Bálsamo suave que cuida la barrera cutánea',
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
        productId: 'illiyoon-ceramide-ato-cream',
        note: 'Ceramidas para barrera (zonas/noche o diario)',
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
      'IMPORTANTE: Si la crema de ceramidas se utiliza durante el día, el protector solar debe quedar como último paso. La rutina puede ajustarse según la necesidad de hidratación y confort.',
  },
  {
    id: 'manchas-luminosidad',
    number: '03',
    title: 'Rutina para Manchas, Hiperpigmentación y Luminosidad',
    goal: 'Tono unificado + luminosidad + protección solar',
    steps: [
      {
        stepNumber: 1,
        label: 'Limpieza Suave',
        productId: 'boj-radiance-cleansing-balm',
        note: 'Bálsamo a aceite que cuida la barrera cutánea',
      },
      {
        stepNumber: 2,
        label: 'Tratamiento Luminosidad',
        productId: 'axis-y-dark-spot-serum',
        alternativeProductIds: ['boj-glow-serum-propolis'],
        note: 'Día: Dark Spot Correcting o Glow Serum Propolis',
      },
      {
        stepNumber: 3,
        label: 'Protección Solar',
        productId: 'boj-relief-sun-rice',
        alternativeProductIds: ['centella-hyalu-cica-sun-serum'],
        note: 'Relief Sun Rice o Centella Hyalu-Cica',
      },
    ],
    instructionType: 'IMPORTANTE',
    instructionText:
      'IMPORTANTE: El tratamiento despigmentante necesita constancia y protector solar todos los días; sin FPS las manchas vuelven.',
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
        productId: 'skin1004-light-cleansing-oil',
        note: 'Limpieza suave sin alterar lípidos',
      },
      {
        stepNumber: 2,
        label: 'Contorno de Ojos',
        productId: 'boj-revive-eye-serum',
        note: 'Ginseng + retinal para la zona periocular',
      },
      {
        stepNumber: 3,
        label: 'Tratamiento Renovador',
        productId: 'cosrx-aha-bha-toner',
        note: 'Exfoliación química suave (noche, 2 a 3 veces por semana)',
      },
      {
        stepNumber: 4,
        label: 'Nutrición Intensiva',
        productId: 'cosrx-snail-92-cream',
        alternativeProductIds: ['medicube-triple-collagen-serum'],
        note: 'Mucina de caracol o Triple Collagen para firmeza',
      },
    ],
    instructionType: 'IMPORTANTE',
    instructionText:
      'IMPORTANTE: El exfoliante AHA/BHA debe incorporarse progresivamente por las noches. Durante el día es indispensable aplicar protector solar de amplio espectro.',
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
        productId: 'anua-heartleaf-cleansing-oil',
        alternativeProductIds: ['cosrx-lowph-good-morning-gel'],
        note: 'Cleansing Oil o Gel Low pH según preferencia',
      },
      {
        stepNumber: 2,
        label: 'Sérum Hidratante',
        productId: 'laneige-cream-skin-refiner',
        note: 'Hidratación tipo crema-piel',
      },
      {
        stepNumber: 3,
        label: 'Sellado Hidratante',
        productId: 'laneige-water-bank-cream',
        note: 'Sellado con ácido hialurónico',
      },
      {
        stepNumber: 4,
        label: 'Protección Solar',
        productId: 'isntree-hyaluronic-sun-gel',
        note: 'FPS50+ acabado acuoso e hidratado',
      },
    ],
    instructionType: 'ORDEN',
    instructionText:
      'ORDEN: Aplicar el refiner sobre la piel ligeramente húmeda antes de la crema para maximizar la retención de agua.',
  },
];
