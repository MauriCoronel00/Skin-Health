import { ProductReview, ProductRatingStats } from '../types';

// Demonstration reviews clearly identified internally with `isExample: true`
// Using natural everyday Paraguayan buyers' tone and varied names as requested
export const INITIAL_DEMO_REVIEWS: ProductReview[] = [
  // Madagascar Centella Ampoule
  {
    id: 'rev-demo-1',
    productId: 'madagascar-centella-ampoule',
    rating: 5,
    comment: 'Me llegó rápido acá en Fernando de la Mora y vino bien embalado. Hasta ahora me gustó bastante, me calma las rojeces enseguida.',
    author: {
      name: 'María González',
      avatarUrl: '',
    },
    createdAt: '2026-09-02T14:22:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Fernando de la Mora',
  },
  {
    id: 'rev-demo-2',
    productId: 'madagascar-centella-ampoule',
    rating: 5,
    comment: 'Lo compré para probar por recomendación de mi dermatóloga y la verdad que me sorprendió la textura ligera.',
    author: {
      name: 'Laura Benítez',
      avatarUrl: '',
    },
    createdAt: '2026-08-28T19:10:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-3',
    productId: 'madagascar-centella-ampoule',
    rating: 4,
    comment: 'Buen producto, llegó sin problemas y era igual a las fotos del catálogo. Rinde muchísimo el frasco de 55ml.',
    author: {
      name: 'Diego Martínez',
      avatarUrl: '',
    },
    createdAt: '2026-08-20T11:45:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'San Lorenzo',
  },
  {
    id: 'rev-demo-4',
    productId: 'madagascar-centella-ampoule',
    rating: 5,
    comment: 'Mi hermana ya lo estaba usando y me lo prestó. Me pedí el mío por WhatsApp y me llegó en el mismo día.',
    author: {
      name: 'Gabriela Fernández',
      avatarUrl: '',
    },
    createdAt: '2026-08-15T16:30:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Luque',
  },
  {
    id: 'rev-demo-5',
    productId: 'madagascar-centella-ampoule',
    rating: 5,
    comment: 'Super liviano para el calor de Asunción, no te deja la cara grasosa ni pesada. 10 puntos la atención.',
    author: {
      name: 'Juan Carlos López',
      avatarUrl: '',
    },
    createdAt: '2026-08-10T10:15:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-6',
    productId: 'madagascar-centella-ampoule',
    rating: 4,
    comment: 'Todo bien con el pedido, llegó en el tiempo que me dijeron cuando mandé la ubicación.',
    author: {
      name: 'Claudia Ramírez',
      avatarUrl: '',
    },
    createdAt: '2026-07-29T18:05:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Lambaré',
  },

  // The Ordinary Niacinamide 10% + Zinc 1%
  {
    id: 'rev-demo-7',
    productId: 'ordinary-niacinamide-zinc',
    rating: 5,
    comment: 'Controla el brillo de la zona T súper bien. Lo uso todas las mañanas antes del protector solar.',
    author: {
      name: 'Sofía Martínez',
      avatarUrl: '',
    },
    createdAt: '2026-09-05T09:40:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-8',
    productId: 'ordinary-niacinamide-zinc',
    rating: 4,
    comment: 'Al principio pica un poquito apenas pero a los dos días ya te acostumbras. Se nota el cambio en los poros.',
    author: {
      name: 'Ana Rodríguez',
      avatarUrl: '',
    },
    createdAt: '2026-08-25T14:15:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Capiatá',
  },
  {
    id: 'rev-demo-9',
    productId: 'ordinary-niacinamide-zinc',
    rating: 5,
    comment: 'Me vino con el precinto original intacto. Muy buena predisposición por WhatsApp para coordinar el delivery.',
    author: {
      name: 'Esteban Bogado',
      avatarUrl: '',
    },
    createdAt: '2026-08-18T17:50:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Mariano Roque Alonso',
  },
  {
    id: 'rev-demo-10',
    productId: 'ordinary-niacinamide-zinc',
    rating: 5,
    comment: 'Es la segunda vez que pido este sérum en Skin Health. El precio está muy accesible para ser importado original.',
    author: {
      name: 'Patricia Duarte',
      avatarUrl: '',
    },
    createdAt: '2026-08-11T12:00:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-11',
    productId: 'ordinary-niacinamide-zinc',
    rating: 4,
    comment: 'Cumple lo que promete, no es milagroso pero ayuda bastante a que la base de maquillaje no se cuartee.',
    author: {
      name: 'Leticia Vera',
      avatarUrl: '',
    },
    createdAt: '2026-07-22T20:30:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Ñemby',
  },

  // Centella Hyalu-Cica Sun Serum
  {
    id: 'rev-demo-12',
    productId: 'centella-hyalu-cica-sun-serum',
    rating: 5,
    comment: 'El mejor protector solar que probé en mi vida. Parece una crema hidratante acuosa, cero rastro blanco ni ojos llorosos.',
    author: {
      name: 'Camila Ayala',
      avatarUrl: '',
    },
    createdAt: '2026-09-08T15:20:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-13',
    productId: 'centella-hyalu-cica-sun-serum',
    rating: 5,
    comment: 'Viene la cajita con el sello original de SKIN1004. Me sorprendió lo rápido que se absorbe.',
    author: {
      name: 'Rodrigo Benítez',
      avatarUrl: '',
    },
    createdAt: '2026-08-30T10:45:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'San Lorenzo',
  },
  {
    id: 'rev-demo-14',
    productId: 'centella-hyalu-cica-sun-serum',
    rating: 5,
    comment: 'Para los días de mucho calor y humedad viene genial porque no transpirás grasa. Recomendadísimo.',
    author: {
      name: 'Valeria Insfrán',
      avatarUrl: '',
    },
    createdAt: '2026-08-19T13:10:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Encarnación',
  },
  {
    id: 'rev-demo-15',
    productId: 'centella-hyalu-cica-sun-serum',
    rating: 4,
    comment: 'Llegó en encomienda al interior en dos días hábiles. Todo impecable.',
    author: {
      name: 'Marcos Giménez',
      avatarUrl: '',
    },
    createdAt: '2026-08-04T16:00:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Ciudad del Este',
  },

  // La Roche-Posay Anthelios UVMune 400 Oil Control
  {
    id: 'rev-demo-16',
    productId: 'laroche-anthelios-oil-control',
    rating: 5,
    comment: 'Toque seco de verdad. No te brilla la frente en todo el día de trabajo.',
    author: {
      name: 'Sebastián Romero',
      avatarUrl: '',
    },
    createdAt: '2026-09-06T18:15:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-17',
    productId: 'laroche-anthelios-oil-control',
    rating: 5,
    comment: 'Excelente producto. Mi dermatólogo me lo indicó por unas manchas solares y es el único que tolero bien.',
    author: {
      name: 'Mirtha Caballero',
      avatarUrl: '',
    },
    createdAt: '2026-08-27T08:30:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Luque',
  },
  {
    id: 'rev-demo-18',
    productId: 'laroche-anthelios-oil-control',
    rating: 4,
    comment: 'Buenísimo el producto. Solo hay que recordar agitarlo bien antes de usar porque es bien líquido.',
    author: {
      name: 'Lucas Coronel',
      avatarUrl: '',
    },
    createdAt: '2026-08-14T11:20:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Lambaré',
  },

  // La Roche-Posay Cicaplast Baume B5+
  {
    id: 'rev-demo-19',
    productId: 'laroche-cicaplast-baume',
    rating: 5,
    comment: 'Es un salvavidas cuando tenés la barrera dañada o la piel irritada del viento. En una noche te calma todo.',
    author: {
      name: 'Florencia Galeano',
      avatarUrl: '',
    },
    createdAt: '2026-09-04T21:10:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-20',
    productId: 'laroche-cicaplast-baume',
    rating: 5,
    comment: 'Lo uso después del retinol cuando siento la piel tirante y funciona increíble. Muy contenta con el servicio.',
    author: {
      name: 'Silvia Maidana',
      avatarUrl: '',
    },
    createdAt: '2026-08-22T14:40:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Villa Elisa',
  },
  {
    id: 'rev-demo-21',
    productId: 'laroche-cicaplast-baume',
    rating: 4,
    comment: 'Es denso, así que una pequeña cantidad ya rinde para toda la cara. Llegó super bien protegido.',
    author: {
      name: 'Fernando Colmán',
      avatarUrl: '',
    },
    createdAt: '2026-08-09T17:15:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'San Antonio',
  },

  // CeraVe Hydrating Cleanser
  {
    id: 'rev-demo-22',
    productId: 'cerave-hydrating-cleanser',
    rating: 5,
    comment: 'No hace espuma exagerada pero limpia sin dejar esa sensación tirante y reseca. Muy recomendado.',
    author: {
      name: 'Belén Franco',
      avatarUrl: '',
    },
    createdAt: '2026-09-01T12:30:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-23',
    productId: 'cerave-hydrating-cleanser',
    rating: 5,
    comment: 'El tamaño de 473ml rinde un montón, casi 4 meses me duró el anterior. Todo en orden con la entrega.',
    author: {
      name: 'Alejandro Acosta',
      avatarUrl: '',
    },
    createdAt: '2026-08-24T19:00:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Fernando de la Mora',
  },

  // CeraVe SA Smoothing Cleanser
  {
    id: 'rev-demo-24',
    productId: 'cerave-sa-cleanser',
    rating: 5,
    comment: 'Me ayudó muchísimo con los granitos de los brazos y la textura de la frente. 100% satisfecho.',
    author: {
      name: 'Carlos Mendoza',
      avatarUrl: '',
    },
    createdAt: '2026-09-03T16:45:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Luque',
  },
  {
    id: 'rev-demo-25',
    productId: 'cerave-sa-cleanser',
    rating: 4,
    comment: 'Muy buen limpiador con ácido salicílico. Llegó en el horario coordinado por WhatsApp.',
    author: {
      name: 'Adriana Ortiz',
      avatarUrl: '',
    },
    createdAt: '2026-08-16T11:10:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'San Lorenzo',
  },

  // The Ordinary Squalane Cleanser
  {
    id: 'rev-demo-26',
    productId: 'ordinary-squalane-cleanser',
    rating: 5,
    comment: 'La textura bálsamo se derrite con el calor de las manos y saca el protector solar a prueba de agua sin frotar.',
    author: {
      name: 'Cecilia Barrios',
      avatarUrl: '',
    },
    createdAt: '2026-09-07T14:50:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-27',
    productId: 'ordinary-squalane-cleanser',
    rating: 4,
    comment: 'Ideal como primer paso de la doble limpieza nocturna. El tubo vino en óptimas condiciones.',
    author: {
      name: 'Gustavo Paiva',
      avatarUrl: '',
    },
    createdAt: '2026-08-17T09:25:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Capiatá',
  },

  // Hyaluronic Acid The Ordinary
  {
    id: 'rev-demo-28',
    productId: 'ordinary-hyaluronic-acid',
    rating: 5,
    comment: 'Lo uso con la cara húmeda y deja la piel súper rellena y suave. La entrega fue rapidísima.',
    author: {
      name: 'Lorena Villalba',
      avatarUrl: '',
    },
    createdAt: '2026-09-02T18:30:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
  {
    id: 'rev-demo-29',
    productId: 'ordinary-hyaluronic-acid',
    rating: 4,
    comment: 'Buen hidratante, no me causó brotes ni alergia. Coordinamos el pago contra entrega sin vueltas.',
    author: {
      name: 'Matias Rojas',
      avatarUrl: '',
    },
    createdAt: '2026-08-12T15:10:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Mariano Roque Alonso',
  },

  // La Roche-Posay Pure Vitamin C10
  {
    id: 'rev-demo-30',
    productId: 'laroche-vitaminc10',
    rating: 5,
    comment: 'Da un brillo saludable impresionante en la piel. Vale cada guaraní por la calidad que tiene.',
    author: {
      name: 'Andrea Cáceres',
      avatarUrl: '',
    },
    createdAt: '2026-08-29T10:05:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },

  // The Ordinary Glycolic Acid 7%
  {
    id: 'rev-demo-31',
    productId: 'ordinary-glycolic-acid-toner',
    rating: 5,
    comment: 'Excelente para unificar textura dos veces por semana de noche. El producto es 100% auténtico.',
    author: {
      name: 'Natalia Samaniego',
      avatarUrl: '',
    },
    createdAt: '2026-08-21T13:40:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Ñemby',
  },

  // SKIN1004 Centella Poremizing Fresh Ampoule
  {
    id: 'rev-demo-32',
    productId: 'centella-poremizing-ampoule',
    rating: 5,
    comment: 'La textura con sal rosa es hermosa y se absorbe al instante. Muy buen trato por WhatsApp.',
    author: {
      name: 'Raquel Vera',
      avatarUrl: '',
    },
    createdAt: '2026-08-26T17:15:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Lambaré',
  },

  // CeraVe Daily Moisturizing Lotion
  {
    id: 'rev-demo-33',
    productId: 'cerave-daily-lotion',
    rating: 5,
    comment: 'Textura ligera pero hidrata todo el día sin dejar pegajoso. Es básica en mi rutina.',
    author: {
      name: 'Hugo Alcaraz',
      avatarUrl: '',
    },
    createdAt: '2026-08-31T11:30:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Fernando de la Mora',
  },

  // CeraVe Resurfacing Retinol Serum
  {
    id: 'rev-demo-34',
    productId: 'cerave-retinol-serum',
    rating: 5,
    comment: 'Retinol muy suave, ideal para principiantes como yo. No me descamó nada y se nota la piel más suave.',
    author: {
      name: 'Viviana Silvero',
      avatarUrl: '',
    },
    createdAt: '2026-09-05T19:20:00Z',
    isExample: true,
    isVerifiedPurchase: false,
    status: 'approved',
    city: 'Asunción',
  },
];

// Calculate review statistics for any product
export function getProductRatingStats(productId: string, allReviews: ProductReview[]): ProductRatingStats {
  const productReviews = allReviews.filter(
    (r) => r.productId === productId && (r.status === 'approved' || r.status === undefined)
  );

  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  if (productReviews.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      distribution,
    };
  }

  let sum = 0;
  for (const rev of productReviews) {
    const star = Math.max(1, Math.min(5, Math.round(rev.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] = (distribution[star] || 0) + 1;
    sum += rev.rating;
  }

  const average = Number((sum / productReviews.length).toFixed(1));

  return {
    averageRating: average,
    totalReviews: productReviews.length,
    distribution,
  };
}
