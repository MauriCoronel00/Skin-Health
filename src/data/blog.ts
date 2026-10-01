export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  date: string;
  readingTime: string;
  heroImage: string;
  sections: {
    heading: string;
    body: string;
    products?: { id: string; name: string; brand: string }[];
  }[];
  faq: { q: string; a: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'rutina-kbeauty-piel-grasa-paraguay',
    title: 'Rutina K-Beauty para Piel Grasa en el Clima de Paraguay',
    metaDescription: 'Descubrí la rutina K-Beauty perfecta para piel grasa en Paraguay. Productos coreanos originales para controlar brillo, poros y acné en clima cálido y húmedo.',
    keywords: ['rutina k-beauty piel grasa', 'skincare Paraguay', 'productos coreanos piel grasa', 'acné Paraguay', 'COSRX piel grasa'],
    date: '2026-09-15',
    readingTime: '6 min',
    heroImage: '/pieles/piel-grasa.webp',
    sections: [
      {
        heading: '¿Por qué la piel grasa necesita una rutina especial en Paraguay?',
        body: 'El clima cálido y húmedo de Paraguay (temperaturas de 25-38°C y humedad relativa del 60-80%) estimula la producción de sebo en la piel. Esto genera brillo excesivo, poros dilatados y brotes de acné. La solución no es lavar la cara más veces, sino usar productos que regulen la producción de sebo sin resecar la barrera cutánea.',
      },
      {
        heading: 'Paso 1: Limpieza doble (doble limpieza coreana)',
        body: 'La doble limpieza es el corazón del skincare coreano. Empezá con un cleansing oil o bálsamo para desmaquillar y disolver el sebo acumulado. Seguí con un gel limpiador de pH bajo (5.5-6.5) que limpie profundamente sin alterar la barrera cutánea.',
        products: [
          { id: 'anua-heartleaf-cleansing-oil', name: 'Heartleaf Cleansing Oil', brand: 'Anua' },
          { id: 'cosrx-lowph-good-morning-gel', name: 'Low pH Good Morning Gel Cleanser', brand: 'COSRX' },
        ],
      },
      {
        heading: 'Paso 2: Tónico equilibrante',
        body: 'Un tónico con ingredientes como Heartleaf (Houttuynia Cordata) o Centella Asiática calma la piel, reduce el enrojecimiento y prepara la piel para absorber los siguientes productos. Evitá los tónicos con alcohol que resecan y rebajan la producción de sebo.',
        products: [
          { id: 'anua-heartleaf-77-toner', name: 'Heartleaf 77 Toner', brand: 'Anua' },
        ],
      },
      {
        heading: 'Paso 3: Sérum para poros y sebo',
        body: 'Los sérums con niacinamida (vitamina B3) y propolis regulan la producción de sebo, minimizan los poros y mejoran la textura de la piel. La niacinamida al 2-5% es el ingrediente estrella para piel grasa.',
        products: [
          { id: 'boj-glow-serum-propolis', name: 'Glow Serum Propolis + Niacinamide', brand: 'Beauty of Joseon' },
          { id: 'centella-poremizing-ampoule', name: 'Poremizing Ampoule', brand: 'Skin1004' },
        ],
      },
      {
        heading: 'Paso 4: Hidratación ligera',
        body: 'La piel grasa también necesita hidratación. Elegí geles o emulsiones ligeras con ácido hialurónico que hidraten sin dejar residuo graso. Las texturas "water gel" son ideales para el clima paraguayo.',
        products: [
          { id: 'laneige-water-bank-cream', name: 'Water Bank Blue Hyaluronic Cream', brand: 'Laneige' },
        ],
      },
      {
        heading: 'Paso 5: Protector solar (obligatorio)',
        body: 'El protector solar es el paso más importante. En Paraguay, con UV index de 8-12, necesitás SPF 50+ PA++++ de amplio espectro. Elegí texturas acuosas o geles que no dejen residuo blanco ni sensación grasosa.',
        products: [
          { id: 'boj-relief-sun-rice', name: 'Relief Sun Rice + Probiotics SPF50+', brand: 'Beauty of Joseon' },
          { id: 'centella-hyalu-cica-sun-serum', name: 'Hyalu-Cica Sun Serum SPF50+', brand: 'Skin1004' },
        ],
      },
    ],
    faq: [
      {
        q: '¿Con qué frecuencia debo lavar la cara si tengo piel grasa?',
        a: 'Máximo 2 veces por día (mañana y noche). Lavar más veces estimula la producción de sebo. Entre lavados, usa papel absorbente o brumificador facial.',
      },
      {
        q: '¿Los productos coreanos son buenos para el clima de Paraguay?',
        a: 'Sí, la cosmética coreana está diseñada para climas húmedos y cálidos similares al de Paraguay. Las texturas ligeras y los ingredientes como Heartleaf y Centella son ideales para nuestra zona.',
      },
      {
        q: '¿Cuánto tiempo tarda en verse resultados?',
        a: 'La piel se renueva cada 28 días. Con constancia, notarás menos brillo y poros más pequeños en 4-6 semanas. Para manchas post-acné, esperá 8-12 semanas.',
      },
    ],
  },
  {
    slug: 'mejores-productos-coreanos-piel-sensible',
    title: 'Los Mejores Productos Coreanos para Piel Sensible',
    metaDescription: 'Guía de productos K-Beauty para piel sensible en Paraguay. Centella Asiática, ceramidas y ácido hialurónico para calmar y reparar la barrera cutánea.',
    keywords: ['productos coreanos piel sensible', 'centella asiática Paraguay', 'piel sensible skincare', 'ceramidas piel', 'SKIN1004 Paraguay'],
    date: '2026-09-10',
    readingTime: '5 min',
    heroImage: '/pieles/piel-sensible.webp',
    sections: [
      {
        heading: '¿Qué hace que la piel sea sensible?',
        body: 'La piel sensible tiene una barrera cutánea debilitada que reacciona fácilmente a factores externos: cambios de temperatura, contaminación, productos agresivos o estrés. Los síntomas incluyen enrojecimiento, picor, tirantez y sensación de ardor.',
      },
      {
        heading: 'Ingredientes calmantes estrella',
        body: 'La Centella Asiática (tiger grass) es el ingrediente calmante por excelencia en la cosmética coreana. Reduce el enrojecimiento, acelera la cicatrización y fortalece la barrera. Las ceramidas reparan la barrera cutánea y previenen la pérdida de humedad.',
      },
      {
        heading: 'Rutina minimalista para piel sensible',
        body: 'Menos es más. Una rutina de 3-4 pasos con productos suaves y sin fragancia es suficiente. Evitá los exfoliantes físicos y los ácidos fuertes (AHA/BHA) hasta que la barrera esté reparada.',
        products: [
          { id: 'madagascar-centella-ampoule', name: 'Madagascar Centella Ampoule', brand: 'Skin1004' },
          { id: 'illiyoon-ceramide-ato-cream', name: 'Ceramide Ato Concentrate Cream', brand: 'Illiyoon' },
        ],
      },
      {
        heading: 'Protección solar para piel sensible',
        body: 'Los protectores solares minerales (con óxido de zinc o dióxido de titanio) son menos irritantes que los químicos. Buscá fórmulas con Centella o ácido hialurónico para calmar mientras protegen.',
        products: [
          { id: 'centella-hyalu-cica-sun-serum', name: 'Hyalu-Cica Sun Serum SPF50+', brand: 'Skin1004' },
        ],
      },
    ],
    faq: [
      {
        q: '¿Puedo usar vitamina C si tengo piel sensible?',
        a: 'Sí, pero elegí formas suaves como el ácido ascórbico al 5-10% o el ascorbyl glucoside. Empezá con 2-3 veces por semana y aumentá gradualmente.',
      },
      {
        q: '¿Cuánto tiempo tarda en repararse la barrera cutánea?',
        a: 'Con productos adecuados, notarás mejoría en 2-4 semanas. La reparación completa puede llevar 2-3 meses. Evitá productos con alcohol, fragancias o aceites esenciales.',
      },
    ],
  },
  {
    slug: 'como-elegir-serum-piel-mixta',
    title: 'Cómo Elegir el Sérum Perfecto para Piel Mixta',
    metaDescription: 'Guía para elegir el sérum ideal para piel mixta en Paraguay. Niacinamida, ácido hialurónico y Centella Asiática para equilibrar zona T y mejillas.',
    keywords: ['sérum piel mixta', 'niacinamida piel mixta', 'ácido hialurónico Paraguay', 'skincare piel mixta', 'Beauty of Joseon sérum'],
    date: '2026-09-05',
    readingTime: '4 min',
    heroImage: '/pieles/piel-mixta.webp',
    sections: [
      {
        heading: '¿Qué es la piel mixta?',
        body: 'La piel mixta combina zona T grasa (frente, nariz, mentón) con mejillas normales o secas. Es el tipo de piel más común en Paraguay debido al clima que estimula la producción de sebo en la zona central del rostro.',
      },
      {
        heading: 'Ingredientes clave para piel mixta',
        body: 'La niacinamida regula el sebo en la zona T sin resecar las mejillas. El ácido hialurónico hidrata las zonas secas. La Centella Asiática calma y equilibra. Podés usar sérums diferentes en distintas zonas o uno universal con estos ingredientes.',
        products: [
          { id: 'boj-glow-serum-propolis', name: 'Glow Serum Propolis + Niacinamide', brand: 'Beauty of Joseon' },
          { id: 'laneige-cream-skin-refiner', name: 'Cream Skin Refiner', brand: 'Laneige' },
        ],
      },
      {
        heading: 'Rutina capa por capa (skinimalism)',
        body: 'La tendencia coreana "skinimalism" propone capas ligeras de productos hidratantes en lugar de una crema pesada. Aplicá sérum + emulsion ligera + protector solar. En las zonas secas, agregá una crema extra solo donde la necesites.',
      },
    ],
    faq: [
      {
        q: '¿Puedo usar el mismo sérum en toda la cara?',
        a: 'Sí, si tiene ingredientes equilibrantes como niacinamida y ácido hialurónico. Si tu zona T es muy grasa, podés aplicar una capa extra solo en las mejillas.',
      },
      {
        q: '¿Cuál es el mejor momento para aplicar el sérum?',
        a: 'Después del tónico y antes de la crema. La piel ligeramente húmeda absorbe mejor los ingredientes activos. Aplicá 3-4 gotas y masajeá suavemente.',
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
