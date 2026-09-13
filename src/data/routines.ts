import { SkincareRoutine } from '../types';

export const SKINCARE_ROUTINES: SkincareRoutine[] = [
  {
    id: 'piel-grasa',
    number: '01',
    title: 'Rutina para Piel Grasa',
    goal: 'Control de sebo + apariencia de poros + protección solar',
    steps: [
      {
        stepNumber: 1,
        label: 'Niacinamida',
        productId: 'ordinary-niacinamide-zinc',
        note: 'Control de sebo y textura',
      },
      {
        stepNumber: 2,
        label: 'Poremizing',
        productId: 'centella-poremizing-ampoule',
        note: 'Minimizador de poros con sal rosa',
      },
      {
        stepNumber: 3,
        label: 'UVMune Oil Control',
        productId: 'laroche-anthelios-oil-control',
        note: 'Protección solar toque seco 12h',
      },
    ],
    instructionType: 'ORDEN',
    instructionText:
      'ORDEN: Aplicar de menor a mayor densidad y terminar la rutina de mañana con el protector solar.',
  },
  {
    id: 'hidratacion-sensible',
    number: '02',
    title: 'Hidratación y Piel Sensible',
    goal: 'Calma + hidratación + apoyo de la barrera cutánea',
    steps: [
      {
        stepNumber: 1,
        label: 'Madagascar Centella',
        productId: 'madagascar-centella-ampoule',
        note: 'Calmante puro de Madagascar',
      },
      {
        stepNumber: 2,
        label: 'Hyalu-Cica SPF',
        productId: 'centella-hyalu-cica-sun-serum',
        note: 'Protector solar hidratante acabado glow',
      },
      {
        stepNumber: 3,
        label: 'Cicaplast (según necesidad)',
        productId: 'laroche-cicaplast-baume',
        note: 'Bálsamo reparador intensivo',
      },
    ],
    instructionType: 'IMPORTANTE',
    instructionText:
      'IMPORTANTE: Si Cicaplast se utiliza durante el día, el protector solar debe quedar como último paso. La rutina puede ajustarse según la necesidad de hidratación y confort.',
  },
  {
    id: 'manchas-luminosidad',
    number: '03',
    title: 'Manchas y Luminosidad',
    goal: 'Vitamina C + exfoliación química + protección solar',
    steps: [
      {
        stepNumber: 1,
        label: 'Vitamin C10',
        productId: 'laroche-vitaminc10',
        note: 'Vitamina C pura antioxidante',
      },
      {
        stepNumber: 2,
        label: 'Glycolic 7%',
        productId: 'ordinary-glycolic-acid-toner',
        note: 'Tónico exfoliante resplandor',
      },
      {
        stepNumber: 3,
        label: 'Protector Solar',
        productId: 'laroche-anthelios-oil-control',
        note: 'Protección solar avanzada antimanchas',
      },
    ],
    instructionType: 'IMPORTANTE',
    instructionText:
      'IMPORTANTE: No es necesario usar vitamina C y ácido glicólico en la misma aplicación. El glicólico se puede reservar para la noche; durante el día, usar protector solar.',
  },
];
