import { Language } from '../types';

export const GS_PER_USD = 5890;
export const GS_PER_BRL = 1140;

export interface Translations {
  flag: string;
  flagLabel: string;
  currency: string;
  currencyLabel: string;
  formatCurrency: (amount: number) => string;

  // Navbar
  searchPlaceholder: string;
  cartLabel: string;
  announcement: string;
  languageLabel: string;

  // Hero
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroCtaQuiz: string;
  heroCtaCatalog: string;
  heroTagline: string;
  officialBrands: string;

  // Catalog
  catalogTitle: string;
  catalogSubtitle: string;
  catalogError: string;
  catalogErrorHint: string;
  catalogEmpty: string;
  catalogEmptyHint: string;
  filterAll: string;
  filterSkin: string;
  filterPrice: string;
  filterBrand: string;
  filterPriceAll: string;
  priceUpTo: string;
  priceOver: string;
  skinGrasa: string;
  skinSeca: string;
  skinMixta: string;
  skinSensible: string;
  exploreByNeed: string;
  productsCount: string;

  // Routines
  routinesTitle: string;
  routinesSubtitle: string;
  routinesStep: string;

  // How it works
  howTitle: string;
  howSubtitle: string;
  howIntro: string;
  howStep1Title: string;
  howStep1Desc: string;
  howStep2Title: string;
  howStep2Desc: string;
  howStep3Title: string;
  howStep3Desc: string;
  howStep3Label1: string;
  howStep3Label2: string;
  howStep4Title: string;
  howStep4Desc: string;

  // Footer
  footerOriginalTitle: string;
  footerOriginalDesc: string;
  footerDeliveryTitle: string;
  footerDeliveryDesc: string;
  footerWhatsTitle: string;
  footerWhatsDesc: string;
  footerOrdered: string;
  footerTrack: string;
  footerFollow: string;
  footerContact: string;
  footerRights: string;
  footerKbeauty: string;
  footerKbeautyTail: string;

  // Cart drawer
  cartEmptyTitle: string;
  cartEmptyDesc: string;
  cartExplore: string;
  cartClear: string;
  cartClearTitle: string;
  cartNameLabel: string;
  cartNamePlaceholder: string;
  cartPhoneLabel: string;
  cartAddressLabel: string;
  cartAddressPlaceholder: string;
  cartMapsPlaceholder: string;
  cartMapsHint: string;
  cartSubtotal: string;
  cartShipping: string;
  cartShippingOptional: string;
  cartShippingHint: string;
  cartTotal: string;
  cartShippingMode: string;
  cartStockVerified: string;
  cartOfficialCare: string;
  cartDecrease: string;
  cartIncrease: string;
  cartFillData: string;
  cartFillDataDesc: string;
  cartLoginRequired: string;
  cartNoStock: string;
  cartWait: string;
  cartWaitDesc: string;
  cartEmptyError: string;
  cartEmptyErrorDesc: string;
  cartSyncError: string;
  cartWhatsAppFallback: string;
  errName: string;
  errUnexpected: string;
  errPhone: string;
  errAddress: string;

  // Order confirmation
  orderSuccessTitle: string;
  orderCode: string;
  orderCopyCode: string;
  orderWhatsTitle: string;
  orderWhatsDesc: string;
  orderPayTitle: string;
  orderPayDesc: string;
  orderDeliveryTitle: string;
  orderDeliveryDesc: string;
  orderItems: string;
  orderShipping: string;
  orderTotal: string;
  orderDestination: string;
  orderReopenWhats: string;

  // Tracking
  trackTitle: string;
  trackCodeLabel: string;
  trackNotFound: string;
  trackCancelled: string;
  trackShippingTo: string;
  trackTotal: string;
  trackMapTitle: string;
  trackMapCta: string;

  // Reviews
  reviewsTitle: string;
  reviewsLeave: string;
  reviewsBasedOn: string;
  reviewsCount: string;
  reviewsSingle: string;
  reviewsSortHelpful: string;
  reviewsSortRecent: string;
  reviewsEmpty: string;
  reviewsShowAll: string;
  reviewsVerified: string;
  reviewsHelpful: string;
  reviewsAskHelpful: string;
  reviewsAttribution: string;
  reviewsLeaveTitle: string;
  reviewsPhoto: string;
  skinTypeOily: string;
  skinTypeDry: string;
  skinTypeCombo: string;
  skinTypeSensitive: string;
  skinTypeNormal: string;

  // Review form
  reviewFormTitle: string;
  reviewFormQ1: string;
  reviewFormQ2: string;
  reviewFormQ3: string;
  reviewFormQ3Hint: string;
  reviewFormQ5: string;
  reviewFormPlaceholder: string;
  reviewFormSubmit: string;
  reviewFormSubmitting: string;
  reviewFormThanks: string;
  reviewFormThanksDesc: string;
  reviewFormMaxPhotos: string;
  reviewFormPhotoError: string;
  reviewFormRatingError: string;
  reviewFormAuthError: string;
  reviewFormCommentError: string;
  reviewFormSaveError: string;
  reviewFormAlreadySent: string;
  reviewGrasa: string;
  reviewSeca: string;
  reviewMixta: string;
  reviewSensible: string;

  // Star rating
  starVeryBad: string;
  starBad: string;
  starRegular: string;
  starGood: string;
  starExcellent: string;
  starAria: string;
  starHint: string;
  starCount: string;

  // Google auth
  authReviewAs: string;
  authLogout: string;
  authContinue: string;
  authPrivacy: string;

  // Diagnostic quiz
  quizClose: string;
  quizTitle: string;
  quizStep: string;
  quizStepOf: string;
  quizContinue: string;
  quizQ1Sub: string;
  quizOptionOily: string;
  quizOptionOilyDesc: string;
  quizOptionCombo: string;
  quizOptionComboDesc: string;
  quizOptionDry: string;
  quizOptionDryDesc: string;
  quizOptionSensitive: string;
  quizOptionSensitiveDesc: string;
  quizQ2Title: string;
  quizQ2Sub: string;
  quizConcernAcne: string;
  quizConcernAcneDesc: string;
  quizConcernSpots: string;
  quizConcernSpotsDesc: string;
  quizConcernLines: string;
  quizConcernLinesDesc: string;
  quizConcernDehydr: string;
  quizConcernDehydrDesc: string;
  quizConcernRedness: string;
  quizConcernRednessDesc: string;
  quizQ3Sub: string;
  quizRoutineBasic: string;
  quizRoutineBasicDesc: string;
  quizRoutineComplete: string;
  quizRoutineCompleteDesc: string;
  quizRoutineAdvanced: string;
  quizRoutineAdvancedDesc: string;
  quizQ4Sub: string;
  quizQ4Daily: string;
  quizResultTitle: string;
  quizRestart: string;
  quizRoutineOily: string;
  quizRoutineSensitive: string;
  quizRoutineSpots: string;
  quizRoutineAntiAge: string;
  quizRoutineUniversal: string;

  // Saved quiz banner
  savedHide: string;
  savedTitle: string;
  savedDesc: string;
  savedRedo: string;
  savedGrasa: string;
  savedMixta: string;
  savedSeca: string;
  savedSensible: string;

  // Welcome popup
  welcomeTitle: string;
  welcomeDesc: string;
  welcomeCta: string;

  // Premium
  premiumTitle: string;
  premiumSubtitle: string;
  premiumCancel: string;

  // Install banner
  installAria: string;
  installIos: string;
  installDesc: string;

  // Floating cart
  floatingCartAria: string;

  // Error boundary
  errorSection: string;

  // Mobile bottom nav
  navHome: string;
  navSearch: string;
  navCart: string;
  navAdvice: string;
  navAccount: string;
  navAria: string;
  navWhatsMessage: string;

  // Admin (gates only)
  adminZone: string;
  adminLoginHint: string;

  // App
  appErrorTitle: string;
  appErrorDesc: string;
  appErrorDetail: string;
  appErrorReload: string;
  appReviewSent: string;
  appReviewSentDesc: string;
  appReviewRedirect: string;

  // Tracking steps
  stepReceived: string;
  stepPaid: string;
  stepShipped: string;
  stepDelivered: string;

  // Testimonios
  testimonialsTitle: string;
  testimonialsAria: string;

  // Cart / checkout (pass 2)
  cartTitle: string;
  cartClose: string;
  cartPhonePlaceholder: string;
  cartRemoveTitle: string;
  cartRemoveItem: string;
  cartUnitPrice: string;
  cartProductsCount: string;
  cartOptional: string;
  cartShippingCoord: string;
  cartShippingFrom: string;
  cartPreparing: string;
  cartOrderCta: string;
  cartPayTransfer: string;
  cartUnavailable: string;
  cartOrderError: string;
  cartOrderErrorDesc: string;
  cartOrderRegistered: string;
  pedErrEmpty: string;
  pedErrCustomerData: string;
  pedErrAuth: string;
  pedErrStock: string;
  pedErrUnavailable: string;
  pedErrFailed: string;

  // Order confirmation (pass 2)
  orderThanks: string;
  orderPrepared: string;
  orderClose: string;
  orderStepsTitle: string;
  orderSummary: string;
  orderRecipient: string;
  orderTrackLive: string;
  orderShareExp: string;

  // Quiz (pass 2)
  quizQ1Title: string;
  quizQ3Title: string;
  quizQ4Title: string;
  quizConcernPores: string;
  quizConcernPoresDesc: string;
  quizQ4DailyDesc: string;
  quizQ4SometimesLabel: string;
  quizQ4SometimesDesc: string;
  quizQ4MakeupLabel: string;
  quizQ4MakeupDesc: string;
  quizQ4NeverLabel: string;
  quizQ4NeverDesc: string;
  quizBack: string;
  quizAnalyzing: string;
  quizViewRoutine: string;
  quizBasedOn: string;
  quizStepsForSkin: string;
  quizViewFull: string;
  savedReadySuffix: string;
  savedDiagnosed: string;

  // Counts / misc
  productCountOne: string;
  productCountOther: string;
  viewOrder: string;
  trackLoading: string;
  commonClose: string;
  mapsLinkLabel: string;

  // Toast (pass 2)
  toastWhatsCta: string;
  toastClose: string;

  // Tracking (pass 2)
  trackViewBtn: string;
  trackAutoRefresh: string;
  trackCurrentState: string;
  trackYourZone: string;
  trackZoneApprox: string;

  // Reviews (pass 2)
  reviewSortBest: string;
  reviewSortWorst: string;
  reviewCountOne: string;
  reviewCountOther: string;
  reviewPhotoLarge: string;
  reviewPhotoExpanded: string;
  reviewPhotosStep: string;
  reviewPhotosHint: string;
  reviewLoginPhotos: string;
  reviewRemovePhoto: string;
  reviewNormal: string;
  reviewPhotoSize: string;
  reviewSortBy: string;
  reviewsClearFilters: string;
  reviewsWithFilters: string;
  reviewReplyBadge: string;

  // Routines (pass 2)
  routinesError: string;
  routinesNoTable: string;
  routinesBadStructure: string;
  routineAddedMsg: string;
  routineAddCta: string;
  routineFullLabel: string;
  viewDetailsOf: string;
  routinesNone: string;
  viewRoutineAria: string;
  routinesCauses: string;
  routinesRls: string;
  routinesBadge: string;

  // Premium
  premiumPlanBadge: string;
  premiumB1: string;
  premiumB2: string;
  premiumB3: string;
  premiumB4: string;
  premiumSubscribe: string;

  // Product card / quick view / nav a11y (pass 2)
  wishlistRemove: string;
  wishlistSave: string;
  productDetails: string;
  addToOrderAria: string;
  quickViewClose: string;
  quickViewPrev: string;
  quickViewNext: string;
  quickViewZoomTitle: string;
  quickViewZoomClose: string;
  newArrival: string;
  leaveReview: string;
  addedExclaim: string;
  navClearSearch: string;
  navOpenOrder: string;
  navOpenOrderItems: string;
  navChangeLanguage: string;
  navSwitchTo: string;
  navLanguageHeader: string;
  installHide: string;
  authSignInGoogle: string;
  reviewFormClose: string;
  toastRegion: string;
  blogBack: string;
  blogReadingTime: string;
  blogFaqTitle: string;
}

type TranslationsMap = Record<Language, Translations>;

export const translations: TranslationsMap = {
  es: {
    flag: '🇵🇾', flagLabel: 'PY', currency: '₲', currencyLabel: 'Guaraníes',
    formatCurrency: (amount: number) => `₲ ${amount.toLocaleString('es-PY')}`,

    searchPlaceholder: 'Buscar producto, marca o ingrediente…',
    cartLabel: 'Pedido',
    announcement: 'Productos 100% originales — Envíos a todo Paraguay',
    languageLabel: 'Idioma',

    heroEyebrow: 'Skincare importado · Asunción, Paraguay',
    heroTitle1: 'Entendé tu piel.',
    heroTitle2: 'Amala.',
    heroSubtitle: 'Rutinas de dermocosmética con productos oficiales. 60 segundos de diagnóstico y armamos tu ritual de 4 pasos.',
    heroCtaQuiz: 'Empezar mi diagnóstico',
    heroCtaCatalog: 'Ver catálogo',
    heroTagline: '· Skincare hecho a tu medida',
    officialBrands: 'Marcas oficiales',

    catalogTitle: 'Catálogo Completo',
    catalogSubtitle: 'fórmulas esenciales seleccionadas para resultados visibles.',
    catalogError: 'No pudimos cargar el catálogo',
    catalogErrorHint: 'Revisá tu conexión e intentá de nuevo. Si sigue fallando, escribinos por WhatsApp.',
    catalogEmpty: 'No hay productos con esos filtros.',
    catalogEmptyHint: 'Intenta buscar con otro término o limpia los filtros para ver los productos disponibles.',
    filterAll: 'Todas',
    filterSkin: 'Piel:',
    filterPrice: 'Precio:',
    filterBrand: 'Marca:',
    filterPriceAll: 'Todos',
    priceUpTo: 'Hasta',
    priceOver: 'Más de',
    skinGrasa: 'Grasa',
    skinSeca: 'Seca',
    skinMixta: 'Mixta',
    skinSensible: 'Sensible',
    exploreByNeed: 'Explorar por Necesidad',
    productsCount: 'producto(s)',

    routinesTitle: 'Encontrá tu rutina',
    routinesSubtitle: 'Cada rutina son 3 a 4 pasos con productos oficiales, en el orden correcto de aplicación. Elegí la que va con tu piel y llévala completa.',
    routinesStep: 'Paso',

    howTitle: 'Flujo de Compra Rápido',
    howSubtitle: '¿Cómo realizo mi pedido?',
    howIntro: 'Sin registros lentos ni pasarelas complejas. Cuatro simples pasos:',
    howStep1Title: 'Elegí tus productos',
    howStep1Desc: 'Presioná "+" en cualquier sérum o crema para sumarlo al carrito.',
    howStep2Title: 'Revisá en tu pedido',
    howStep2Desc: 'Tocá el carrito flotante para verificar cantidades y el total estimado.',
    howStep3Title: 'Datos para el envío',
    howStep3Desc: 'Completá en el carrito tus datos para coordinar la entrega:',
    howStep3Label1: 'Nombre del cliente',
    howStep3Label2: 'Lugar de ubicación para envío',
    howStep4Title: 'Pedir por WhatsApp',
    howStep4Desc: 'Se abrirá tu chat con la lista completa de productos y todos tus datos listos para confirmar.',

    footerOriginalTitle: '100% Originales',
    footerOriginalDesc: 'Productos importados de marcas oficiales de Corea del Sur.',
    footerDeliveryTitle: 'Delivery en Paraguay',
    footerDeliveryDesc: 'Entregas en el día en Asunción y Gran Asunción. Envíos a todo el interior.',
    footerWhatsTitle: 'Pedidos por WhatsApp',
    footerWhatsDesc: 'Sin registros engorrosos. Armás tu carrito y coordinamos todo directo por chat.',
    footerOrdered: '¿Ya pediste?',
    footerTrack: 'Seguir mi pedido',
    footerFollow: 'Síguenos en las redes:',
    footerContact: 'Atención y pedidos al instante:',
    footerRights: 'Todos los derechos reservados.',
    footerKbeauty: 'K-beauty hecha con',
    footerKbeautyTail: 'para tu piel.',

    cartEmptyTitle: 'Tu carrito está vacío',
    cartEmptyDesc: 'Explora nuestro catálogo y presiona "+" para agregar productos.',
    cartExplore: 'Explorar Catálogo',
    cartClear: 'Vaciar',
    cartClearTitle: 'Vaciar carrito',
    cartNameLabel: 'Nombre del cliente',
    cartNamePlaceholder: 'Ej. Sol Ovelar',
    cartPhoneLabel: 'Teléfono de contacto (WhatsApp)',
    cartAddressLabel: 'Lugar de ubicación para el envío',
    cartAddressPlaceholder: 'Ej. Barrio Herrera, Asunción',
    cartMapsPlaceholder: 'Ej. https://maps.app.goo.gl/... o enlace de ubicación',
    cartMapsHint: 'Si no tenés el link ahora, también podés adjuntar tu ubicación en tiempo real directamente en WhatsApp.',
    cartSubtotal: 'Subtotal',
    cartShipping: 'Envío',
    cartShippingOptional: 'Envío – distancia en km (opcional)',
    cartShippingHint: 'Medí tu distancia en Maps. Si no sabés, dejalo en 0 y lo coordinamos por WhatsApp.',
    cartTotal: 'TOTAL ESTIMADO',
    cartShippingMode: 'Envío coordinado',
    cartStockVerified: 'Stock verificado',
    cartOfficialCare: 'Atención oficial Skin Health',
    cartDecrease: 'Disminuir cantidad',
    cartIncrease: 'Aumentar cantidad',
    cartFillData: 'Datos para el envío',
    cartFillDataDesc: 'Completá tu nombre, teléfono y ubicación para coordinar la entrega.',
    cartLoginRequired: 'Iniciá sesión para continuar',
    cartNoStock: 'Sin stock suficiente',
    cartWait: 'Esperá un momento',
    cartWaitDesc: 'Tu pedido anterior se está procesando. Intentá de nuevo en unos segundos.',
    cartEmptyError: 'El carrito está vacío',
    cartEmptyErrorDesc: 'Agregá productos antes de confirmar.',
    cartSyncError: 'No se pudo sincronizar el carrito',
    cartWhatsAppFallback: 'Si no se abrió WhatsApp automáticamente, podés hacer clic abajo.',
    errName: 'Ingresá tu nombre para registrar tu pedido.',
    errPhone: 'Ingresá un teléfono válido (mínimo 8 dígitos) para coordinar por WhatsApp.',
    errAddress: 'Indicá tu barrio y ciudad para coordinar el envío.',
    errUnexpected: 'Error inesperado.',

    orderSuccessTitle: '¡Pedido Registrado con Éxito!',
    orderCode: 'Código de Pedido:',
    orderCopyCode: 'Copiar código',
    orderWhatsTitle: 'Confirmación por WhatsApp',
    orderWhatsDesc: 'Nuestro equipo confirmará la disponibilidad inmediata de tus productos.',
    orderPayTitle: 'Método de pago flexible',
    orderPayDesc: 'Podés abonar vía transferencia bancaria (SIPAP) o en efectivo / POS al recibir el paquete.',
    orderDeliveryTitle: 'Entrega rápida a tu ubicación',
    orderDeliveryDesc: 'Envío seguro con motodelivery en Asunción y Gran Asunción o encomienda express al interior del país.',
    orderItems: 'Ítems',
    orderShipping: 'Envío',
    orderTotal: 'Total',
    orderDestination: 'Destino de envío:',
    orderReopenWhats: 'Reabrir chat de WhatsApp',

    trackTitle: 'Seguí tu pedido',
    trackCodeLabel: 'Código de pedido',
    trackNotFound: 'No encontramos ese código. Revisalo e intentá de nuevo.',
    trackCancelled: 'Este pedido fue cancelado. Escribinos y lo armamos de nuevo.',
    trackShippingTo: 'Envío a',
    trackTotal: 'Total',
    trackMapTitle: 'Mapa de entrega',
    trackMapCta: 'Cómo llegar desde nuestro local',

    reviewsTitle: 'Opiniones de clientes',
    reviewsLeave: 'Dejar una reseña',
    reviewsBasedOn: 'Basado en',
    reviewsCount: 'opiniones',
    reviewsSingle: 'reseña',
    reviewsSortHelpful: 'Más útiles',
    reviewsSortRecent: 'Más recientes',
    reviewsEmpty: 'No hay opiniones con esta cantidad de estrellas todavía.',
    reviewsShowAll: 'Ver todas las opiniones',
    reviewsVerified: 'Este cliente compró el producto en Skin Health',
    reviewsHelpful: 'Te resultó útil',
    reviewsAskHelpful: '¿Te resultó útil?',
    reviewsAttribution: 'Opinión de cliente de Skin Health',
    reviewsLeaveTitle: 'Déjanos tu opinión',
    reviewsPhoto: 'Foto de reseña',
    skinTypeOily: 'Piel grasa',
    skinTypeDry: 'Piel seca',
    skinTypeCombo: 'Piel mixta',
    skinTypeSensitive: 'Piel sensible',
    skinTypeNormal: 'Piel normal',

    reviewFormTitle: 'Dejá tu valoración sincera',
    reviewFormQ1: '1. ¿Qué puntuación le das al producto?',
    reviewFormQ2: '2. Tu comentario u opinión (Opcional)',
    reviewFormQ3: '3. Tu tipo de piel (Opcional, ayuda a otros clientes)',
    reviewFormQ3Hint: 'Contanos tu experiencia: textura, cómo te sentió en la piel, rapidez de entrega...',
    reviewFormQ5: '5. Identificación antes de publicar',
    reviewFormPlaceholder: 'Contanos tu experiencia: textura, cómo te sentió en la piel, rapidez de entrega...',
    reviewFormSubmit: 'Publicar mi Reseña',
    reviewFormSubmitting: 'Publicando opinión...',
    reviewFormThanks: '¡Muchas gracias por tu opinión!',
    reviewFormThanksDesc: 'Tu opinión quedó en revisión y será visible tras la moderación. ¡Gracias por ayudar a la comunidad!',
    reviewFormMaxPhotos: 'Máximo 3 fotos por reseña.',
    reviewFormPhotoError: 'No pudimos subir la foto. Probá de nuevo.',
    reviewFormRatingError: 'Por favor selecciona una calificación de 1 a 5 estrellas.',
    reviewFormAuthError: 'Por favor identifícate con tu cuenta Google para firmar tu valoración.',
    reviewFormCommentError: 'El comentario no es válido.',
    reviewFormSaveError: 'No pudimos guardar tu reseña. Probá de nuevo.',
    reviewFormAlreadySent: 'Ya tenés una reseña enviada para este producto.',
    reviewGrasa: 'Grasa',
    reviewSeca: 'Seca',
    reviewMixta: 'Mixta',
    reviewSensible: 'Sensible',

    starVeryBad: 'Muy malo',
    starBad: 'Malo',
    starRegular: 'Regular',
    starGood: 'Bueno',
    starExcellent: 'Excelente',
    starAria: 'Calificación de 1 a 5 estrellas',
    starHint: 'Toca las estrellas para calificar',
    starCount: 'estrellas',

    authReviewAs: 'Tu reseña se publica a nombre de',
    authLogout: 'Cerrar sesión',
    authContinue: 'Continuar con Google',
    authPrivacy: 'Solo usamos tu nombre público para firmar tu opinión. Sin contraseñas ni spam.',

    quizClose: 'Cerrar diagnóstico',
    quizTitle: 'Diagnóstico de Piel',
    quizStep: 'Paso',
    quizStepOf: 'de',
    quizContinue: 'Continuar',
    quizQ1Sub: 'Seleccioná la que mejor te describe',
    quizOptionOily: 'Piel grasa / con brillo',
    quizOptionOilyDesc: 'Brillo en zona T, poros visibles, tendencia a granitos.',
    quizOptionCombo: 'Piel mixta',
    quizOptionComboDesc: 'Zona T grasa y mejillas normales o secas.',
    quizOptionDry: 'Piel seca / tirante',
    quizOptionDryDesc: 'Sensación de tirantez, escamas, falta de luminosidad.',
    quizOptionSensitive: 'Piel sensible / reactiva',
    quizOptionSensitiveDesc: 'Enrojecimiento fácil, irritación con productos nuevos.',
    quizQ2Title: 'Preocupación principal',
    quizQ2Sub: 'Podés elegir más de una',
    quizConcernAcne: 'Acné / granos',
    quizConcernAcneDesc: 'Granitos, puntos negros, brotes frecuentes.',
    quizConcernSpots: 'Manchas / hiperpigmentación',
    quizConcernSpotsDesc: 'Marcas de acné, manchas solares, tono desigual.',
    quizConcernLines: 'Líneas de expresión / firmeza',
    quizConcernLinesDesc: 'Arrugas finas, pérdida de elasticidad.',
    quizConcernDehydr: 'Deshidratación / falta de luminosidad',
    quizConcernDehydrDesc: 'Piel opaca, áspera, sin vitalidad.',
    quizConcernRedness: 'Enrojecimiento / rosácea',
    quizConcernRednessDesc: 'Rojez persistente, sensibilidad, vasos visibles.',
    quizQ3Sub: 'Según tu tiempo y compromiso',
    quizRoutineBasic: 'Básica (3 pasos)',
    quizRoutineBasicDesc: 'Limpieza, hidratación y protector solar.',
    quizRoutineComplete: 'Completa (4 pasos)',
    quizRoutineCompleteDesc: 'Agrega tónico o sérum según tu preocupación.',
    quizRoutineAdvanced: 'Avanzada (5+ pasos)',
    quizRoutineAdvancedDesc: 'Múltiples sérums, tratamientos y máscaras.',
    quizQ4Sub: 'Clave para definir tu rutina de día',
    quizQ4Daily: 'Todos los días, llueva o truene',
    quizResultTitle: '¡Tu rutina está lista!',
    quizRestart: 'Hacer el diagnóstico de nuevo',
    quizRoutineOily: 'Rutina para Piel Grasa y Tendencia al Acné',
    quizRoutineSensitive: 'Rutina para Piel Sensible y Barrera Cutánea',
    quizRoutineSpots: 'Rutina para Manchas, Hiperpigmentación y Luminosidad',
    quizRoutineAntiAge: 'Rutina Anti-Edad y Textura (Renovación)',
    quizRoutineUniversal: 'Rutina Básica de Hidratación Universal',

    savedHide: 'Ocultar recomendación guardada',
    savedTitle: '¡Tu rutina te espera!',
    savedDesc: 'Hola de nuevo. Aquí tienes tu rutina para',
    savedRedo: 'Rehacer diagnóstico',
    savedGrasa: 'Piel grasa',
    savedMixta: 'Piel mixta',
    savedSeca: 'Piel seca',
    savedSensible: 'Piel sensible',

    welcomeTitle: 'Descubrí tu rutina ideal',
    welcomeDesc: 'Hacé el diagnóstico gratis de 60 segundos y te armamos tu ritual de 4 pasos con productos oficiales.',
    welcomeCta: 'Hacer mi diagnóstico gratis',

    premiumTitle: 'Suscripción Premium',
    premiumSubtitle: 'Acceso exclusivo para cuidar tu piel sin equivocarte. Asesoría 100% enfocada a tu necesidad.',
    premiumCancel: 'Cancelás cuando quieras. Atención directa por WhatsApp.',

    installAria: 'Instalar aplicación',
    installIos: 'En iPhone: tocá Compartir y elegí Agregar a pantalla de inicio.',
    installDesc: 'Agregá Skin Health a tu inicio para comprar en 1 toque.',

    floatingCartAria: 'Carrito flotante de compras',

    errorSection: 'Esta sección no está disponible temporalmente.',

    navHome: 'Inicio',
    navSearch: 'Buscar',
    navCart: 'Pedido',
    navAdvice: 'Asesoría',
    navAccount: 'Cuenta',
    navAria: 'Navegación principal',
    navWhatsMessage: 'Hola Skin Health, necesito asesoría para elegir mi rutina.',

    adminZone: 'Zona de administradores',
    adminLoginHint: 'Iniciá sesión con una cuenta administradora.',

    appErrorTitle: 'Algo salió mal',
    appErrorDesc: 'La aplicación se encontró con un error inesperado.',
    appErrorDetail: 'Ver detalle técnico',
    appErrorReload: 'Recargar página',
    appReviewSent: '¡Reseña enviada!',
    appReviewSentDesc: 'Quedará visible luego de la moderación. ¡Gracias!',
    appReviewRedirect: 'Te redirigimos al login de Google. Volvé a enviar tu reseña al regresar.',

    stepReceived: 'Recibido',
    stepPaid: 'Pagado',
    stepShipped: 'En camino',
    stepDelivered: 'Entregado',

    testimonialsTitle: 'Opiniones de clientas verificadas',
    testimonialsAria: 'de 5 estrellas',

    // ——— pass 2 ———
    cartTitle: 'Mi Pedido',
    cartClose: 'Cerrar pedido',
    cartPhonePlaceholder: 'Ej. 0971 123 456',
    cartRemoveTitle: 'Eliminar del pedido',
    cartRemoveItem: 'Eliminar {name}',
    cartUnitPrice: 'Unitario:',
    cartProductsCount: 'Productos ({count})',
    cartOptional: 'Opcional',
    cartShippingCoord: 'Se coordina por WhatsApp',
    cartShippingFrom: 'Salimos de {origin} ({base} hasta 3 km + {perKm}/km).',
    cartPreparing: 'Preparando tu pedido...',
    cartOrderCta: 'PEDIR POR WHATSAPP →',
    cartPayTransfer: 'Pago por transferencia',
    cartUnavailable: 'Producto no disponible',
    cartOrderError: 'No pudimos registrar tu pedido',
    cartOrderErrorDesc: 'Tu carrito está a salvo. Probá de nuevo en unos segundos.',
    cartOrderRegistered: 'Tu pedido fue registrado',
    pedErrEmpty: 'Agregá productos antes de confirmar.',
    pedErrCustomerData: 'Revisá los datos del pedido (nombre, ubicación y teléfono) e intentá de nuevo.',
    pedErrAuth: 'Iniciá sesión para coordinar la entrega.',
    pedErrStock: 'Algún producto se quedó sin stock. Ajustá cantidades e intentá de nuevo.',
    pedErrUnavailable: 'Algún producto ya no está disponible. Revisá tu carrito e intentá de nuevo.',
    pedErrFailed: 'Tu carrito está a salvo. Probá de nuevo en unos segundos.',

    orderThanks: 'Gracias por tu compra',
    orderPrepared: 'Hemos preparado tu pedido y te redirigimos al WhatsApp oficial para coordinar el despacho.',
    orderClose: 'Cerrar modal',
    orderStepsTitle: 'Siguientes pasos de entrega',
    orderSummary: 'Resumen de Productos',
    orderRecipient: 'Destinatario:',
    orderTrackLive: 'Seguir mi pedido en vivo',
    orderShareExp: 'Contar mi experiencia',

    quizQ1Title: 'Tipo de piel',
    quizQ3Title: 'Nivel de rutina',
    quizQ4Title: 'Protector solar',
    quizConcernPores: 'Poros dilatados',
    quizConcernPoresDesc: 'Textura irregular, puntos negros',
    quizQ4DailyDesc: 'Hábito instalado, reaplico cada 2-3hs',
    quizQ4SometimesLabel: 'Solo cuando salgo al sol directo',
    quizQ4SometimesDesc: 'Playa, pileta, deporte al aire libre',
    quizQ4MakeupLabel: 'Solo si mi base/crema tiene SPF',
    quizQ4MakeupDesc: 'Dependo del SPF del maquillaje',
    quizQ4NeverLabel: 'Casi nunca / me olvido',
    quizQ4NeverDesc: 'No es parte de mi rutina actual',
    quizBack: 'Volver',
    quizAnalyzing: 'Analizando...',
    quizViewRoutine: 'Ver mi rutina',
    quizBasedOn: 'Basado en tus respuestas, te recomendamos:',
    quizStepsForSkin: '{count} pasos personalizados para tu piel',
    quizViewFull: 'Ver mi rutina completa',
    savedReadySuffix: 'lista para pedir.',
    savedDiagnosed: 'Diagnosticado {date}',

    productCountOne: 'producto',
    productCountOther: 'productos',
    viewOrder: 'Ver pedido',
    trackLoading: 'Cargando seguimiento…',
    commonClose: 'Cerrar',
    mapsLinkLabel: 'Enlace de Google Maps',

    toastWhatsCta: 'Pedir directamente por WhatsApp',
    toastClose: 'Cerrar notificación',

    trackViewBtn: 'Ver',
    trackAutoRefresh: 'actualiza solo cada 30 seg',
    trackCurrentState: 'Estado actual',
    trackYourZone: 'tu zona',
    trackZoneApprox: 'Zona de entrega aproximada',

    reviewSortBest: 'Mejor puntaje',
    reviewSortWorst: 'Peor puntaje',
    reviewCountOne: 'reseña',
    reviewCountOther: 'reseñas',
    reviewPhotoLarge: 'Ver foto en grande',
    reviewPhotoExpanded: 'Foto de reseña ampliada',
    reviewPhotosStep: '4. Fotos del producto',
    reviewPhotosHint: '(Opcional, hasta 3)',
    reviewLoginPhotos: 'Identificate primero para subir fotos.',
    reviewRemovePhoto: 'Eliminar foto',
    reviewNormal: 'Normal',
    reviewPhotoSize: 'La foto debe pesar menos de 5MB.',
    reviewSortBy: 'Ordenar:',
    reviewsClearFilters: 'Limpiar filtros',
    reviewsWithFilters: 'con estos filtros',
    reviewReplyBadge: 'Skin Health responde',

    routinesError: 'Error cargando rutinas:',
    routinesNoTable: 'La tabla skincare_routines no tiene datos',
    routinesBadStructure: 'Estructura de tabla incorrecta',
    routineAddedMsg: 'Listo, va en tu pedido',
    routineAddCta: 'Llevo esta rutina ({count})',
    routineFullLabel: 'Rutina completa · {count} productos',
    viewDetailsOf: 'Ver detalles de {brand} {name}',
    routinesNone: 'No se encontraron rutinas',
    viewRoutineAria: 'Ver rutina {title}',
    routinesCauses: 'Posibles causas:',
    routinesRls: 'RLS (Row Level Security) bloqueando acceso anónimo',
    routinesBadge: '5 rituales · 5 tipos de piel',

    premiumPlanBadge: 'Plan mensual',
    premiumB1: 'Rutina 100% personalizada + seguimiento mensual',
    premiumB2: 'Atención prioritaria por WhatsApp',
    premiumB3: 'Acceso anticipado a nuevos ingresos',
    premiumB4: 'Envíos Priority a todo el país',
    premiumSubscribe: 'Suscribirme — {price}/mes',

    wishlistRemove: 'Quitar de la wishlist',
    wishlistSave: 'Guardar en wishlist',
    productDetails: 'Ver detalles del producto',
    addToOrderAria: 'Agregar {name} al pedido',
    quickViewClose: 'Cerrar detalles',
    quickViewPrev: 'Producto anterior',
    quickViewNext: 'Producto siguiente',
    quickViewZoomTitle: 'Imagen del producto ampliada',
    quickViewZoomClose: 'Cerrar imagen ampliada',
    newArrival: 'Nuevo ingreso',
    leaveReview: 'Dejar opinión',
    addedExclaim: '¡Agregado!',
    navClearSearch: 'Limpiar búsqueda',
    navOpenOrder: 'Abrir mi pedido',
    navOpenOrderItems: 'Abrir mi pedido, {count} productos',
    navChangeLanguage: 'Cambiar idioma',
    navSwitchTo: 'Cambiar a {lang}',
    navLanguageHeader: 'Idioma',
    installHide: 'Ocultar aviso',
    authSignInGoogle: 'Ingresar con Google',
    reviewFormClose: 'Cerrar formulario',
    toastRegion: 'Notificaciones',
    blogBack: 'Volver al blog',
    blogReadingTime: '{minutes} de lectura',
    blogFaqTitle: 'Preguntas frecuentes',
  },

  pt: {
    flag: '🇧🇷', flagLabel: 'BR', currency: 'R$', currencyLabel: 'Reais',
    formatCurrency: (amount: number) => {
      const brl = amount / GS_PER_BRL;
      return `R$ ${brl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    searchPlaceholder: 'Buscar produto, marca ou ingrediente…',
    cartLabel: 'Pedido',
    announcement: 'Produtos 100% originais — Entregas em todo o Paraguai',
    languageLabel: 'Idioma',

    heroEyebrow: 'Skincare importado · Assunção, Paraguai',
    heroTitle1: 'Entenda sua pele.',
    heroTitle2: 'Ame-a.',
    heroSubtitle: 'Rotinas de dermocosmética com produtos oficiais. 60 segundos de diagnóstico e montamos seu ritual de 4 passos.',
    heroCtaQuiz: 'Começar meu diagnóstico',
    heroCtaCatalog: 'Ver catálogo',
    heroTagline: '· Skincare feito sob medida',
    officialBrands: 'Marcas oficiais',

    catalogTitle: 'Catálogo Completo',
    catalogSubtitle: 'fórmulas essenciais selecionadas para resultados visíveis.',
    catalogError: 'Não pudimos carregar o catálogo',
    catalogErrorHint: 'Verifique sua conexão e tente novamente. Se continuar falhando, fale conosco no WhatsApp.',
    catalogEmpty: 'Não há produtos com esses filtros.',
    catalogEmptyHint: 'Tente buscar com outro termo ou limpe os filtros para ver os produtos disponíveis.',
    filterAll: 'Todas',
    filterSkin: 'Pele:',
    filterPrice: 'Preço:',
    filterBrand: 'Marca:',
    filterPriceAll: 'Todos',
    priceUpTo: 'Até',
    priceOver: 'Acima de',
    skinGrasa: 'Oleosa',
    skinSeca: 'Seca',
    skinMixta: 'Mista',
    skinSensible: 'Sensível',
    exploreByNeed: 'Explorar por Necessidade',
    productsCount: 'produto(s)',

    routinesTitle: 'Encontre sua rotina',
    routinesSubtitle: 'Cada rotina tem 3 a 4 passos com produtos oficiais, na ordem correta de aplicação. Escolha a que combina com sua pele e leve completa.',
    routinesStep: 'Passo',

    howTitle: 'Fluxo de Compra Rápido',
    howSubtitle: 'Como faço meu pedido?',
    howIntro: 'Sem cadastros lentos nem portais complexos. Quatro passos simples:',
    howStep1Title: 'Escolha seus produtos',
    howStep1Desc: 'Pressione "+" em qualquer sérum ou creme para adicionar ao carrinho.',
    howStep2Title: 'Revise seu pedido',
    howStep2Desc: 'Toque no carrinho flutuante para verificar quantidades e total estimado.',
    howStep3Title: 'Dados para a entrega',
    howStep3Desc: 'Preencha no carrinho seus dados para coordinar a entrega:',
    howStep3Label1: 'Nome do cliente',
    howStep3Label2: 'Local de entrega',
    howStep4Title: 'Pedir por WhatsApp',
    howStep4Desc: 'Seu chat será aberto com a lista completa de produtos e todos os dados prontos para confirmar.',

    footerOriginalTitle: '100% Originais',
    footerOriginalDesc: 'Produtos importados de marcas oficiais da Coreia do Sul.',
    footerDeliveryTitle: 'Delivery no Paraguai',
    footerDeliveryDesc: 'Entregas no mesmo dia em Assunção e Gran Asunción. Envios para todo o interior.',
    footerWhatsTitle: 'Pedidos por WhatsApp',
    footerWhatsDesc: 'Sem cadastros complicados. Monte seu carrinho e coordenamos tudo direto no chat.',
    footerOrdered: 'Já pediu?',
    footerTrack: 'Acompanhar meu pedido',
    footerFollow: 'Siga-nos nas redes:',
    footerContact: 'Atendimento e pedidos imediatos:',
    footerRights: 'Todos os direitos reservados.',
    footerKbeauty: 'K-beauty feita com',
    footerKbeautyTail: 'para sua pele.',

    cartEmptyTitle: 'Seu carrinho está vazio',
    cartEmptyDesc: 'Explore nosso catálogo e pressione "+" para adicionar produtos.',
    cartExplore: 'Explorar Catálogo',
    cartClear: 'Esvaziar',
    cartClearTitle: 'Esvaziar carrinho',
    cartNameLabel: 'Nome do cliente',
    cartNamePlaceholder: 'Ex. Sol Ovelar',
    cartPhoneLabel: 'Telefone de contato (WhatsApp)',
    cartAddressLabel: 'Local de entrega',
    cartAddressPlaceholder: 'Ex. Barrio Herrera, Assunção',
    cartMapsPlaceholder: 'Ex. https://maps.app.goo.gl/... ou link de localização',
    cartMapsHint: 'Se não tem o link agora, também pode enviar sua localização em tempo real direto no WhatsApp.',
    cartSubtotal: 'Subtotal',
    cartShipping: 'Entrega',
    cartShippingOptional: 'Entrega – distância em km (opcional)',
    cartShippingHint: 'Meça sua distância no Maps. Se não souber, deixe em 0 e coordenamos por WhatsApp.',
    cartTotal: 'TOTAL ESTIMADO',
    cartShippingMode: 'Entrega coordenada',
    cartStockVerified: 'Estoque verificado',
    cartOfficialCare: 'Atendimento oficial Skin Health',
    cartDecrease: 'Diminuir quantidade',
    cartIncrease: 'Aumentar quantidade',
    cartFillData: 'Dados para a entrega',
    cartFillDataDesc: 'Preencha seu nome, telefone e localização para coordenar a entrega.',
    cartLoginRequired: 'Faça login para continuar',
    cartNoStock: 'Sem estoque suficiente',
    cartWait: 'Aguarde um momento',
    cartWaitDesc: 'Seu pedido anterior está sendo processado. Tente novamente em alguns segundos.',
    cartEmptyError: 'O carrinho está vazio',
    cartEmptyErrorDesc: 'Adicione produtos antes de confirmar.',
    cartSyncError: 'Não foi possível sincronizar o carrinho',
    cartWhatsAppFallback: 'Se o WhatsApp não abriu automaticamente, clique abaixo.',
    errName: 'Digite seu nome para registrar o pedido.',
    errPhone: 'Digite um telefone válido (mínimo 8 dígitos) para coordenar por WhatsApp.',
    errAddress: 'Informe seu bairro e cidade para coordenar a entrega.',
    errUnexpected: 'Erro inesperado.',

    orderSuccessTitle: 'Pedido Registrado com Sucesso!',
    orderCode: 'Código do Pedido:',
    orderCopyCode: 'Copiar código',
    orderWhatsTitle: 'Confirmação por WhatsApp',
    orderWhatsDesc: 'Nossa equipe confirmará a disponibilidade imediata dos seus produtos.',
    orderPayTitle: 'Método de pagamento flexível',
    orderPayDesc: 'Você pode pagar via transferência bancária (SIPAP) ou em dinheiro / POS ao receber o pacote.',
    orderDeliveryTitle: 'Entrega rápida na sua localização',
    orderDeliveryDesc: 'Envio seguro com motoboy em Assunção e Gran Asunción ou encomenda expressa para o interior.',
    orderItems: 'Itens',
    orderShipping: 'Entrega',
    orderTotal: 'Total',
    orderDestination: 'Destino da entrega:',
    orderReopenWhats: 'Reabrir chat do WhatsApp',

    trackTitle: 'Acompanhe seu pedido',
    trackCodeLabel: 'Código do pedido',
    trackNotFound: 'Não encontramos esse código. Verifique e tente novamente.',
    trackCancelled: 'Este pedido foi cancelado. Fale conosco e montamos novamente.',
    trackShippingTo: 'Entrega para',
    trackTotal: 'Total',
    trackMapTitle: 'Mapa de entrega',
    trackMapCta: 'Como chegar desde nossa loja',

    reviewsTitle: 'Opiniões de clientes',
    reviewsLeave: 'Deixar uma avaliação',
    reviewsBasedOn: 'Baseado em',
    reviewsCount: 'opiniões',
    reviewsSingle: 'avaliação',
    reviewsSortHelpful: 'Mais úteis',
    reviewsSortRecent: 'Mais recentes',
    reviewsEmpty: 'Não há opiniões com essa quantidade de estrelas ainda.',
    reviewsShowAll: 'Ver todas as opiniões',
    reviewsVerified: 'Este cliente comprou o produto na Skin Health',
    reviewsHelpful: 'Foi útil para você',
    reviewsAskHelpful: 'Foi útil para você?',
    reviewsAttribution: 'Opinión de cliente de Skin Health',
    reviewsLeaveTitle: 'Deixe sua opinião',
    reviewsPhoto: 'Foto da avaliação',
    skinTypeOily: 'Pele oleosa',
    skinTypeDry: 'Pele seca',
    skinTypeCombo: 'Pele mista',
    skinTypeSensitive: 'Pele sensível',
    skinTypeNormal: 'Pele normal',

    reviewFormTitle: 'Deixe sua avaliação sincera',
    reviewFormQ1: '1. Que nota você dá ao produto?',
    reviewFormQ2: '2. Seu comentário ou opinião (Opcional)',
    reviewFormQ3: '3. Seu tipo de pele (Opcional, ajuda outros clientes)',
    reviewFormQ3Hint: 'Conte sua experiência: textura, como sentiu na pele, rapidez da entrega...',
    reviewFormQ5: '5. Identificação antes de publicar',
    reviewFormPlaceholder: 'Conte sua experiência: textura, como sentiu na pele, rapidez da entrega...',
    reviewFormSubmit: 'Publicar minha Avaliação',
    reviewFormSubmitting: 'Publicando opinião...',
    reviewFormThanks: 'Muito obrigado pela sua opinião!',
    reviewFormThanksDesc: 'Sua opinião ficou em revisão e será visível após a moderação. Obrigado por ajudar a comunidade!',
    reviewFormMaxPhotos: 'Máximo 3 fotos por avaliação.',
    reviewFormPhotoError: 'Não pudemos enviar a foto. Tente novamente.',
    reviewFormRatingError: 'Por favor selecione uma nota de 1 a 5 estrelas.',
    reviewFormAuthError: 'Por favor identifique-se com sua conta Google para assinar sua avaliação.',
    reviewFormCommentError: 'O comentário não é válido.',
    reviewFormSaveError: 'Não pudemos salvar sua avaliação. Tente novamente.',
    reviewFormAlreadySent: 'Você já enviou uma avaliação para este produto.',
    reviewGrasa: 'Oleosa',
    reviewSeca: 'Seca',
    reviewMixta: 'Mista',
    reviewSensible: 'Sensível',

    starVeryBad: 'Muito ruim',
    starBad: 'Ruim',
    starRegular: 'Regular',
    starGood: 'Bom',
    starExcellent: 'Excelente',
    starAria: 'Nota de 1 a 5 estrelas',
    starHint: 'Toque nas estrelas para avaliar',
    starCount: 'estrelas',

    authReviewAs: 'Sua avaliação será publicada em nome de',
    authLogout: 'Sair',
    authContinue: 'Continuar com Google',
    authPrivacy: 'Só usamos seu nome público para assinar sua opinião. Sem senhas nem spam.',

    quizClose: 'Fechar diagnóstico',
    quizTitle: 'Diagnóstico de Pele',
    quizStep: 'Passo',
    quizStepOf: 'de',
    quizContinue: 'Continuar',
    quizQ1Sub: 'Selecione a que melhor te descreve',
    quizOptionOily: 'Pele oleosa / brilhante',
    quizOptionOilyDesc: 'Brilho na zona T, poros visíveis, tendência a espinhas.',
    quizOptionCombo: 'Pele mista',
    quizOptionComboDesc: 'Zona T oleosa e bochechas normais ou secas.',
    quizOptionDry: 'Pele seca / tensa',
    quizOptionDryDesc: 'Sensação de tensão, escamas, falta de luminosidade.',
    quizOptionSensitive: 'Pele sensível / reativa',
    quizOptionSensitiveDesc: 'Vermelhidão fácil, irritação com produtos novos.',
    quizQ2Title: 'Preocupação principal',
    quizQ2Sub: 'Pode escolher mais de uma',
    quizConcernAcne: 'Acne / espinhas',
    quizConcernAcneDesc: 'Espinhas, pontos negros, surtos frequentes.',
    quizConcernSpots: 'Manchas / hiperpigmentação',
    quizConcernSpotsDesc: 'Marcas de acne, manchas solares, tom desigual.',
    quizConcernLines: 'Linhas de expressão / firmeza',
    quizConcernLinesDesc: 'Rugas finas, perda de elasticidade.',
    quizConcernDehydr: 'Desidratação / falta de luminosidade',
    quizConcernDehydrDesc: 'Pele opaca, áspera, sem vitalidade.',
    quizConcernRedness: 'Vermelhidão / rosácea',
    quizConcernRednessDesc: 'Vermelhidão persistente, sensibilidade, vasos visíveis.',
    quizQ3Sub: 'De acordo com seu tempo e compromisso',
    quizRoutineBasic: 'Básica (3 passos)',
    quizRoutineBasicDesc: 'Limpeza, hidratação e protetor solar.',
    quizRoutineComplete: 'Completa (4 passos)',
    quizRoutineCompleteDesc: 'Adiciona tônico ou sérum conforme sua preocupação.',
    quizRoutineAdvanced: 'Avançada (5+ passos)',
    quizRoutineAdvancedDesc: 'Múltiplos sérums, tratamentos e máscaras.',
    quizQ4Sub: 'Chave para definir sua rotina de dia',
    quizQ4Daily: 'Todos os dias, chuva ou sol',
    quizResultTitle: 'Sua rotina está pronta!',
    quizRestart: 'Refazer o diagnóstico',
    quizRoutineOily: 'Rotina para Pele Oleosa e Tendência a Acne',
    quizRoutineSensitive: 'Rotina para Pele Sensível e Barreira Cutânea',
    quizRoutineSpots: 'Rotina para Manchas, Hiperpigmentação e Luminosidade',
    quizRoutineAntiAge: 'Rotina Anti-Idade e Textura (Renovação)',
    quizRoutineUniversal: 'Rotina Básica de Hidratação Universal',

    savedHide: 'Ocultar recomendação salva',
    savedTitle: 'Sua rotina está esperando!',
    savedDesc: 'Olá novamente. Aqui está sua rotina para',
    savedRedo: 'Refazer diagnóstico',
    savedGrasa: 'Pele oleosa',
    savedMixta: 'Pele mista',
    savedSeca: 'Pele seca',
    savedSensible: 'Pele sensível',

    welcomeTitle: 'Descubra sua rotina ideal',
    welcomeDesc: 'Faça o diagnóstico grátis de 60 segundos e montamos seu ritual de 4 passos com produtos oficiais.',
    welcomeCta: 'Fazer meu diagnóstico grátis',

    premiumTitle: 'Assinatura Premium',
    premiumSubtitle: 'Acesso exclusivo para cuidar da sua pele sem errar. Assessoria 100% focada na sua necessidade.',
    premiumCancel: 'Cancele quando quiser. Atendimento direto por WhatsApp.',

    installAria: 'Instalar aplicação',
    installIos: 'No iPhone: toque em Compartilhar e escolha Adicionar à Tela de Início.',
    installDesc: 'Adicione a Skin Health à sua tela inicial para comprar em 1 toque.',

    floatingCartAria: 'Carrinho flutuante de compras',

    errorSection: 'Esta seção não está disponível temporariamente.',

    navHome: 'Início',
    navSearch: 'Buscar',
    navCart: 'Pedido',
    navAdvice: 'Assessoria',
    navAccount: 'Conta',
    navAria: 'Navegação principal',
    navWhatsMessage: 'Olá Skin Health, preciso de assessoria para escolher minha rotina.',

    adminZone: 'Área de administradores',
    adminLoginHint: 'Faça login com uma conta administradora.',

    appErrorTitle: 'Algo deu errado',
    appErrorDesc: 'O aplicativo encontrou um erro inesperado.',
    appErrorDetail: 'Ver detalhe técnico',
    appErrorReload: 'Recarregar página',
    appReviewSent: 'Avaliação enviada!',
    appReviewSentDesc: 'Ficará visível após a moderação. Obrigado!',
    appReviewRedirect: 'Redirecionamos ao login do Google. Reenvie sua avaliação ao voltar.',

    stepReceived: 'Recebido',
    stepPaid: 'Pago',
    stepShipped: 'A caminho',
    stepDelivered: 'Entregue',

    testimonialsTitle: 'Opiniões de clientes verificados',
    testimonialsAria: 'de 5 estrelas',

    // ——— pass 2 ———
    cartTitle: 'Meu Pedido',
    cartClose: 'Fechar pedido',
    cartPhonePlaceholder: 'Ex.: 0971 123 456',
    cartRemoveTitle: 'Remover do pedido',
    cartRemoveItem: 'Remover {name}',
    cartUnitPrice: 'Unitário:',
    cartProductsCount: 'Produtos ({count})',
    cartOptional: 'Opcional',
    cartShippingCoord: 'Coordena por WhatsApp',
    cartShippingFrom: 'Saímos de {origin} ({base} até 3 km + {perKm}/km).',
    cartPreparing: 'Preparando seu pedido...',
    cartOrderCta: 'PEDIR POR WHATSAPP →',
    cartPayTransfer: 'Pagamento por transferência',
    cartUnavailable: 'Produto indisponível',
    cartOrderError: 'Não foi possível registrar seu pedido',
    cartOrderErrorDesc: 'Seu carrinho está seguro. Tente de novo em alguns segundos.',
    cartOrderRegistered: 'Seu pedido foi registrado',
    pedErrEmpty: 'Adicione produtos antes de confirmar.',
    pedErrCustomerData: 'Revise os dados do pedido (nome, endereço e telefone) e tente novamente.',
    pedErrAuth: 'Faça login para coordenar a entrega.',
    pedErrStock: 'Algum produto ficou sem estoque. Ajuste as quantidades e tente novamente.',
    pedErrUnavailable: 'Algum produto não está mais disponível. Revise seu carrinho e tente novamente.',
    pedErrFailed: 'Seu carrinho está seguro. Tente de novo em alguns segundos.',

    orderThanks: 'Obrigado pela sua compra',
    orderPrepared: 'Preparamos seu pedido e o redirecionamos ao WhatsApp oficial para coordenar a entrega.',
    orderClose: 'Fechar modal',
    orderStepsTitle: 'Próximos passos da entrega',
    orderSummary: 'Resumo dos Produtos',
    orderRecipient: 'Destinatário:',
    orderTrackLive: 'Acompanhar meu pedido ao vivo',
    orderShareExp: 'Compartilhar minha experiência',

    quizQ1Title: 'Tipo de pele',
    quizQ3Title: 'Nível de rotina',
    quizQ4Title: 'Protetor solar',
    quizConcernPores: 'Poros dilatados',
    quizConcernPoresDesc: 'Textura irregular, cravos',
    quizQ4DailyDesc: 'Hábito instalado, reaplico a cada 2-3h',
    quizQ4SometimesLabel: 'Só quando saio ao sol direto',
    quizQ4SometimesDesc: 'Praia, piscina, esporte ao ar livre',
    quizQ4MakeupLabel: 'Só se minha base/creme tem FPS',
    quizQ4MakeupDesc: 'Dependo do FPS da maquiagem',
    quizQ4NeverLabel: 'Quase nunca / esqueço',
    quizQ4NeverDesc: 'Não faz parte da minha rotina atual',
    quizBack: 'Voltar',
    quizAnalyzing: 'Analisando...',
    quizViewRoutine: 'Ver minha rotina',
    quizBasedOn: 'Com base nas suas respostas, recomendamos:',
    quizStepsForSkin: '{count} passos personalizados para a sua pele',
    quizViewFull: 'Ver minha rotina completa',
    savedReadySuffix: 'pronta para pedir.',
    savedDiagnosed: 'Diagnosticado em {date}',

    productCountOne: 'produto',
    productCountOther: 'produtos',
    viewOrder: 'Ver pedido',
    trackLoading: 'Carregando rastreamento…',
    commonClose: 'Fechar',
    mapsLinkLabel: 'Link do Google Maps',

    toastWhatsCta: 'Pedir diretamente no WhatsApp',
    toastClose: 'Fechar notificação',

    trackViewBtn: 'Ver',
    trackAutoRefresh: 'atualiza a cada 30 s',
    trackCurrentState: 'Estado atual',
    trackYourZone: 'sua zona',
    trackZoneApprox: 'Zona de entrega aproximada',

    reviewSortBest: 'Melhor avaliação',
    reviewSortWorst: 'Pior avaliação',
    reviewCountOne: 'avaliação',
    reviewCountOther: 'avaliações',
    reviewPhotoLarge: 'Ver foto em tamanho grande',
    reviewPhotoExpanded: 'Foto da avaliação ampliada',
    reviewPhotosStep: '4. Fotos do produto',
    reviewPhotosHint: '(Opcional, até 3)',
    reviewLoginPhotos: 'Identifique-se primeiro para enviar fotos.',
    reviewRemovePhoto: 'Remover foto',
    reviewNormal: 'Normal',
    reviewPhotoSize: 'A foto deve ter menos de 5MB.',
    reviewSortBy: 'Ordenar:',
    reviewsClearFilters: 'Limpar filtros',
    reviewsWithFilters: 'com esses filtros',
    reviewReplyBadge: 'Skin Health responde',

    routinesError: 'Erro ao carregar rotinas:',
    routinesNoTable: 'A tabela skincare_routines não tem dados',
    routinesBadStructure: 'Estrutura de tabela incorreta',
    routineAddedMsg: 'Pronto, vai no seu pedido',
    routineAddCta: 'Levar esta rotina ({count})',
    routineFullLabel: 'Rotina completa · {count} produtos',
    viewDetailsOf: 'Ver detalhes de {brand} {name}',
    routinesNone: 'Nenhuma rotina encontrada',
    viewRoutineAria: 'Ver rotina {title}',
    routinesCauses: 'Possíveis causas:',
    routinesRls: 'RLS (Row Level Security) bloqueando acesso anônimo',
    routinesBadge: '5 rituais · 5 tipos de pele',

    premiumPlanBadge: 'Plano mensal',
    premiumB1: 'Rotina 100% personalizada + acompanhamento mensal',
    premiumB2: 'Atendimento prioritário por WhatsApp',
    premiumB3: 'Acesso antecipado a novos produtos',
    premiumB4: 'Envios Priority para todo o país',
    premiumSubscribe: 'Assinar — {price}/mês',

    wishlistRemove: 'Remover da lista de desejos',
    wishlistSave: 'Salvar na lista de desejos',
    productDetails: 'Ver detalhes do produto',
    addToOrderAria: 'Adicionar {name} ao pedido',
    quickViewClose: 'Fechar detalhes',
    quickViewPrev: 'Produto anterior',
    quickViewNext: 'Próximo produto',
    quickViewZoomTitle: 'Imagem do produto ampliada',
    quickViewZoomClose: 'Fechar imagem ampliada',
    newArrival: 'Novidade',
    leaveReview: 'Deixar opinião',
    addedExclaim: 'Adicionado!',
    navClearSearch: 'Limpar busca',
    navOpenOrder: 'Abrir meu pedido',
    navOpenOrderItems: 'Abrir meu pedido, {count} produtos',
    navChangeLanguage: 'Alterar idioma',
    navSwitchTo: 'Mudar para {lang}',
    navLanguageHeader: 'Idioma',
    installHide: 'Ocultar aviso',
    authSignInGoogle: 'Entrar com Google',
    reviewFormClose: 'Fechar formulário',
    toastRegion: 'Notificações',
    blogBack: 'Voltar ao blog',
    blogReadingTime: '{minutes} de leitura',
    blogFaqTitle: 'Perguntas frequentes',
  },

  en: {
    flag: '🇺🇸', flagLabel: 'US', currency: '$', currencyLabel: 'USD',
    formatCurrency: (amount: number) => {
      const usd = amount / GS_PER_USD;
      return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    searchPlaceholder: 'Search product, brand or ingredient…',
    cartLabel: 'Cart',
    announcement: '100% original products — Shipping to all Paraguay',
    languageLabel: 'Language',

    heroEyebrow: 'Imported skincare · Asunción, Paraguay',
    heroTitle1: 'Understand your skin.',
    heroTitle2: 'Love it.',
    heroSubtitle: 'Dermocosmetic routines with official products. 60-second diagnosis and we build your 4-step ritual.',
    heroCtaQuiz: 'Start my diagnosis',
    heroCtaCatalog: 'View catalog',
    heroTagline: '· Skincare made for you',
    officialBrands: 'Official brands',

    catalogTitle: 'Full Catalog',
    catalogSubtitle: 'essential formulas selected for visible results.',
    catalogError: 'We couldn\'t load the catalog',
    catalogErrorHint: 'Check your connection and try again. If it keeps failing, message us on WhatsApp.',
    catalogEmpty: 'No products match those filters.',
    catalogEmptyHint: 'Try searching with a different term or clear the filters to see available products.',
    filterAll: 'All',
    filterSkin: 'Skin:',
    filterPrice: 'Price:',
    filterBrand: 'Brand:',
    filterPriceAll: 'All',
    priceUpTo: 'Up to',
    priceOver: 'Over',
    skinGrasa: 'Oily',
    skinSeca: 'Dry',
    skinMixta: 'Combination',
    skinSensible: 'Sensitive',
    exploreByNeed: 'Explore by Need',
    productsCount: 'product(s)',

    routinesTitle: 'Find your routine',
    routinesSubtitle: 'Each routine has 3 to 4 steps with official products, in the correct order of application. Choose the one for your skin and get the full set.',
    routinesStep: 'Step',

    howTitle: 'Quick Shopping Flow',
    howSubtitle: 'How do I place my order?',
    howIntro: 'No slow sign-ups or complex gateways. Four simple steps:',
    howStep1Title: 'Choose your products',
    howStep1Desc: 'Press "+" on any serum or cream to add it to your cart.',
    howStep2Title: 'Review your order',
    howStep2Desc: 'Tap the floating cart to check quantities and estimated total.',
    howStep3Title: 'Delivery details',
    howStep3Desc: 'Fill in your details in the cart to coordinate delivery:',
    howStep3Label1: 'Customer name',
    howStep3Label2: 'Delivery location',
    howStep4Title: 'Order via WhatsApp',
    howStep4Desc: 'Your chat will open with the full product list and all your details ready to confirm.',

    footerOriginalTitle: '100% Original',
    footerOriginalDesc: 'Products imported from official South Korean brands.',
    footerDeliveryTitle: 'Delivery in Paraguay',
    footerDeliveryDesc: 'Same-day delivery in Asunción and Gran Asunción. Shipping nationwide.',
    footerWhatsTitle: 'Orders via WhatsApp',
    footerWhatsDesc: 'No hassle sign-ups. Build your cart and we coordinate everything directly in chat.',
    footerOrdered: 'Already ordered?',
    footerTrack: 'Track my order',
    footerFollow: 'Follow us on social media:',
    footerContact: 'Instant support and orders:',
    footerRights: 'All rights reserved.',
    footerKbeauty: 'K-beauty made with',
    footerKbeautyTail: 'for your skin.',

    cartEmptyTitle: 'Your cart is empty',
    cartEmptyDesc: 'Browse our catalog and press "+" to add products.',
    cartExplore: 'Browse Catalog',
    cartClear: 'Clear',
    cartClearTitle: 'Clear cart',
    cartNameLabel: 'Customer name',
    cartNamePlaceholder: 'e.g. Sol Ovelar',
    cartPhoneLabel: 'Contact phone (WhatsApp)',
    cartAddressLabel: 'Delivery location',
    cartAddressPlaceholder: 'e.g. Barrio Herrera, Asunción',
    cartMapsPlaceholder: 'e.g. https://maps.app.goo.gl/... or location link',
    cartMapsHint: 'If you don\'t have the link now, you can also share your live location directly on WhatsApp.',
    cartSubtotal: 'Subtotal',
    cartShipping: 'Shipping',
    cartShippingOptional: 'Shipping – distance in km (optional)',
    cartShippingHint: 'Measure your distance on Maps. If unsure, leave it at 0 and we\'ll coordinate via WhatsApp.',
    cartTotal: 'ESTIMATED TOTAL',
    cartShippingMode: 'Coordinated shipping',
    cartStockVerified: 'Stock verified',
    cartOfficialCare: 'Official Skin Health support',
    cartDecrease: 'Decrease quantity',
    cartIncrease: 'Increase quantity',
    cartFillData: 'Delivery details',
    cartFillDataDesc: 'Fill in your name, phone and location to coordinate delivery.',
    cartLoginRequired: 'Sign in to continue',
    cartNoStock: 'Not enough stock',
    cartWait: 'Please wait',
    cartWaitDesc: 'Your previous order is being processed. Try again in a few seconds.',
    cartEmptyError: 'Your cart is empty',
    cartEmptyErrorDesc: 'Add products before confirming.',
    cartSyncError: 'Could not sync cart',
    cartWhatsAppFallback: 'If WhatsApp didn\'t open automatically, click below.',
    errName: 'Enter your name to place the order.',
    errPhone: 'Enter a valid phone (at least 8 digits) to coordinate via WhatsApp.',
    errAddress: 'Enter your neighborhood and city to coordinate shipping.',
    errUnexpected: 'Unexpected error.',

    orderSuccessTitle: 'Order Placed Successfully!',
    orderCode: 'Order Code:',
    orderCopyCode: 'Copy code',
    orderWhatsTitle: 'WhatsApp Confirmation',
    orderWhatsDesc: 'Our team will confirm immediate availability of your products.',
    orderPayTitle: 'Flexible payment method',
    orderPayDesc: 'You can pay via bank transfer (SIPAP) or cash / card on delivery.',
    orderDeliveryTitle: 'Fast delivery to your location',
    orderDeliveryDesc: 'Safe delivery with motorcycle courier in Asunción and Gran Asunción or express shipping nationwide.',
    orderItems: 'Items',
    orderShipping: 'Shipping',
    orderTotal: 'Total',
    orderDestination: 'Shipping destination:',
    orderReopenWhats: 'Reopen WhatsApp chat',

    trackTitle: 'Track your order',
    trackCodeLabel: 'Order code',
    trackNotFound: 'We couldn\'t find that code. Check it and try again.',
    trackCancelled: 'This order was cancelled. Message us and we\'ll set it up again.',
    trackShippingTo: 'Shipping to',
    trackTotal: 'Total',
    trackMapTitle: 'Delivery map',
    trackMapCta: 'Directions from our store',

    reviewsTitle: 'Customer reviews',
    reviewsLeave: 'Leave a review',
    reviewsBasedOn: 'Based on',
    reviewsCount: 'reviews',
    reviewsSingle: 'review',
    reviewsSortHelpful: 'Most helpful',
    reviewsSortRecent: 'Most recent',
    reviewsEmpty: 'No reviews with this star rating yet.',
    reviewsShowAll: 'See all reviews',
    reviewsVerified: 'This customer purchased the product at Skin Health',
    reviewsHelpful: 'Was this helpful',
    reviewsAskHelpful: 'Was this helpful?',
    reviewsAttribution: 'Skin Health customer review',
    reviewsLeaveTitle: 'Leave your review',
    reviewsPhoto: 'Review photo',
    skinTypeOily: 'Oily skin',
    skinTypeDry: 'Dry skin',
    skinTypeCombo: 'Combination skin',
    skinTypeSensitive: 'Sensitive skin',
    skinTypeNormal: 'Normal skin',

    reviewFormTitle: 'Leave your honest review',
    reviewFormQ1: '1. What rating do you give this product?',
    reviewFormQ2: '2. Your comment or opinion (Optional)',
    reviewFormQ3: '3. Your skin type (Optional, helps other customers)',
    reviewFormQ3Hint: 'Tell us your experience: texture, how it felt on your skin, delivery speed...',
    reviewFormQ5: '5. Identification before publishing',
    reviewFormPlaceholder: 'Tell us your experience: texture, how it felt on your skin, delivery speed...',
    reviewFormSubmit: 'Publish My Review',
    reviewFormSubmitting: 'Publishing review...',
    reviewFormThanks: 'Thank you so much for your opinion!',
    reviewFormThanksDesc: 'Your review is under review and will be visible after moderation. Thanks for helping the community!',
    reviewFormMaxPhotos: 'Maximum 3 photos per review.',
    reviewFormPhotoError: 'We couldn\'t upload the photo. Try again.',
    reviewFormRatingError: 'Please select a rating of 1 to 5 stars.',
    reviewFormAuthError: 'Please sign in with your Google account to submit your review.',
    reviewFormCommentError: 'The comment is not valid.',
    reviewFormSaveError: 'We couldn\'t save your review. Try again.',
    reviewFormAlreadySent: 'You\'ve already submitted a review for this product.',
    reviewGrasa: 'Oily',
    reviewSeca: 'Dry',
    reviewMixta: 'Combination',
    reviewSensible: 'Sensitive',

    starVeryBad: 'Very bad',
    starBad: 'Bad',
    starRegular: 'Average',
    starGood: 'Good',
    starExcellent: 'Excellent',
    starAria: 'Rating of 1 to 5 stars',
    starHint: 'Tap the stars to rate',
    starCount: 'stars',

    authReviewAs: 'Your review will be published as',
    authLogout: 'Sign out',
    authContinue: 'Continue with Google',
    authPrivacy: 'We only use your public name to sign your opinion. No passwords or spam.',

    quizClose: 'Close diagnosis',
    quizTitle: 'Skin Diagnosis',
    quizStep: 'Step',
    quizStepOf: 'of',
    quizContinue: 'Continue',
    quizQ1Sub: 'Select the one that best describes you',
    quizOptionOily: 'Oily / shiny skin',
    quizOptionOilyDesc: 'Shine in T-zone, visible pores, acne-prone.',
    quizOptionCombo: 'Combination skin',
    quizOptionComboDesc: 'Oily T-zone with normal or dry cheeks.',
    quizOptionDry: 'Dry / tight skin',
    quizOptionDryDesc: 'Tightness, flaking, lack of radiance.',
    quizOptionSensitive: 'Sensitive / reactive skin',
    quizOptionSensitiveDesc: 'Easy redness, irritation with new products.',
    quizQ2Title: 'Main concern',
    quizQ2Sub: 'You can choose more than one',
    quizConcernAcne: 'Acne / breakouts',
    quizConcernAcneDesc: 'Pimples, blackheads, frequent breakouts.',
    quizConcernSpots: 'Dark spots / hyperpigmentation',
    quizConcernSpotsDesc: 'Acne marks, sun spots, uneven tone.',
    quizConcernLines: 'Expression lines / firmness',
    quizConcernLinesDesc: 'Fine wrinkles, loss of elasticity.',
    quizConcernDehydr: 'Dehydration / lack of radiance',
    quizConcernDehydrDesc: 'Dull, rough skin without vitality.',
    quizConcernRedness: 'Redness / rosacea',
    quizConcernRednessDesc: 'Persistent redness, sensitivity, visible capillaries.',
    quizQ3Sub: 'Based on your time and commitment',
    quizRoutineBasic: 'Basic (3 steps)',
    quizRoutineBasicDesc: 'Cleansing, hydration and sunscreen.',
    quizRoutineComplete: 'Complete (4 steps)',
    quizRoutineCompleteDesc: 'Adds toner or serum based on your concern.',
    quizRoutineAdvanced: 'Advanced (5+ steps)',
    quizRoutineAdvancedDesc: 'Multiple serums, treatments and masks.',
    quizQ4Sub: 'Key to defining your daytime routine',
    quizQ4Daily: 'Every day, rain or shine',
    quizResultTitle: 'Your routine is ready!',
    quizRestart: 'Take the diagnosis again',
    quizRoutineOily: 'Routine for Oily & Acne-Prone Skin',
    quizRoutineSensitive: 'Routine for Sensitive Skin & Skin Barrier',
    quizRoutineSpots: 'Routine for Dark Spots, Hyperpigmentation & Radiance',
    quizRoutineAntiAge: 'Anti-Aging & Texture Routine (Renewal)',
    quizRoutineUniversal: 'Universal Basic Hydration Routine',

    savedHide: 'Hide saved recommendation',
    savedTitle: 'Your routine is waiting!',
    savedDesc: 'Welcome back. Here\'s your routine for',
    savedRedo: 'Redo diagnosis',
    savedGrasa: 'Oily skin',
    savedMixta: 'Combination skin',
    savedSeca: 'Dry skin',
    savedSensible: 'Sensitive skin',

    welcomeTitle: 'Discover your ideal routine',
    welcomeDesc: 'Take the free 60-second diagnosis and we\'ll build your 4-step ritual with official products.',
    welcomeCta: 'Take my free diagnosis',

    premiumTitle: 'Premium Subscription',
    premiumSubtitle: 'Exclusive access to care for your skin without mistakes. 100% focused advisory on your needs.',
    premiumCancel: 'Cancel anytime. Direct support via WhatsApp.',

    installAria: 'Install app',
    installIos: 'On iPhone: tap Share and choose Add to Home Screen.',
    installDesc: 'Add Skin Health to your home screen to shop in 1 tap.',

    floatingCartAria: 'Floating shopping cart',

    errorSection: 'This section is temporarily unavailable.',

    navHome: 'Home',
    navSearch: 'Search',
    navCart: 'Cart',
    navAdvice: 'Advice',
    navAccount: 'Account',
    navAria: 'Main navigation',
    navWhatsMessage: 'Hi Skin Health, I need advice to choose my routine.',

    adminZone: 'Admin area',
    adminLoginHint: 'Sign in with an admin account.',

    appErrorTitle: 'Something went wrong',
    appErrorDesc: 'The application encountered an unexpected error.',
    appErrorDetail: 'View technical details',
    appErrorReload: 'Reload page',
    appReviewSent: 'Review submitted!',
    appReviewSentDesc: 'It will be visible after moderation. Thank you!',
    appReviewRedirect: 'We redirected you to Google login. Submit your review again when you return.',

    stepReceived: 'Received',
    stepPaid: 'Paid',
    stepShipped: 'Shipped',
    stepDelivered: 'Delivered',

    testimonialsTitle: 'Verified customer reviews',
    testimonialsAria: 'out of 5 stars',

    // ——— pass 2 ———
    cartTitle: 'My Order',
    cartClose: 'Close order',
    cartPhonePlaceholder: 'E.g. 0971 123 456',
    cartRemoveTitle: 'Remove from order',
    cartRemoveItem: 'Remove {name}',
    cartUnitPrice: 'Unit price:',
    cartProductsCount: 'Products ({count})',
    cartOptional: 'Optional',
    cartShippingCoord: 'Coordinated via WhatsApp',
    cartShippingFrom: 'We ship from {origin} ({base} up to 3 km + {perKm}/km).',
    cartPreparing: 'Preparing your order...',
    cartOrderCta: 'ORDER ON WHATSAPP →',
    cartPayTransfer: 'Bank transfer payment',
    cartUnavailable: 'Product unavailable',
    cartOrderError: "We couldn't register your order",
    cartOrderErrorDesc: 'Your cart is safe. Try again in a few seconds.',
    cartOrderRegistered: 'Your order was registered',
    pedErrEmpty: 'Add products before confirming.',
    pedErrCustomerData: 'Check your order details (name, address and phone) and try again.',
    pedErrAuth: 'Sign in to coordinate delivery.',
    pedErrStock: 'A product is out of stock. Adjust quantities and try again.',
    pedErrUnavailable: 'A product is no longer available. Check your cart and try again.',
    pedErrFailed: 'Your cart is safe. Try again in a few seconds.',

    orderThanks: 'Thank you for your purchase',
    orderPrepared: 'We have prepared your order and redirected you to the official WhatsApp to coordinate delivery.',
    orderClose: 'Close modal',
    orderStepsTitle: 'Next delivery steps',
    orderSummary: 'Product Summary',
    orderRecipient: 'Recipient:',
    orderTrackLive: 'Track my order live',
    orderShareExp: 'Share my experience',

    quizQ1Title: 'Skin type',
    quizQ3Title: 'Routine level',
    quizQ4Title: 'Sunscreen',
    quizConcernPores: 'Enlarged pores',
    quizConcernPoresDesc: 'Uneven texture, blackheads',
    quizQ4DailyDesc: 'Built-in habit, reapply every 2-3h',
    quizQ4SometimesLabel: 'Only when I go out in direct sun',
    quizQ4SometimesDesc: 'Beach, pool, outdoor sports',
    quizQ4MakeupLabel: 'Only if my foundation/cream has SPF',
    quizQ4MakeupDesc: "I rely on my makeup's SPF",
    quizQ4NeverLabel: 'Almost never / I forget',
    quizQ4NeverDesc: "Not part of my current routine",
    quizBack: 'Back',
    quizAnalyzing: 'Analyzing...',
    quizViewRoutine: 'View my routine',
    quizBasedOn: 'Based on your answers, we recommend:',
    quizStepsForSkin: '{count} steps personalized for your skin',
    quizViewFull: 'View my full routine',
    savedReadySuffix: 'ready to order.',
    savedDiagnosed: 'Diagnosed on {date}',

    productCountOne: 'product',
    productCountOther: 'products',
    viewOrder: 'View order',
    trackLoading: 'Loading tracking…',
    commonClose: 'Close',
    mapsLinkLabel: 'Google Maps link',

    toastWhatsCta: 'Order directly on WhatsApp',
    toastClose: 'Close notification',

    trackViewBtn: 'View',
    trackAutoRefresh: 'updates every 30 s',
    trackCurrentState: 'Current status',
    trackYourZone: 'your area',
    trackZoneApprox: 'Approximate delivery area',

    reviewSortBest: 'Highest rated',
    reviewSortWorst: 'Lowest rated',
    reviewCountOne: 'review',
    reviewCountOther: 'reviews',
    reviewPhotoLarge: 'View photo full size',
    reviewPhotoExpanded: 'Enlarged review photo',
    reviewPhotosStep: '4. Product photos',
    reviewPhotosHint: '(Optional, up to 3)',
    reviewLoginPhotos: 'Sign in first to upload photos.',
    reviewRemovePhoto: 'Remove photo',
    reviewNormal: 'Normal',
    reviewPhotoSize: 'The photo must be under 5MB.',
    reviewSortBy: 'Sort:',
    reviewsClearFilters: 'Clear filters',
    reviewsWithFilters: 'with these filters',
    reviewReplyBadge: 'Skin Health replies',

    routinesError: 'Error loading routines:',
    routinesNoTable: 'The skincare_routines table has no data',
    routinesBadStructure: 'Wrong table structure',
    routineAddedMsg: "Done, it's in your order",
    routineAddCta: 'Take this routine ({count})',
    routineFullLabel: 'Full routine · {count} products',
    viewDetailsOf: 'View details of {brand} {name}',
    routinesNone: 'No routines found',
    viewRoutineAria: 'View routine {title}',
    routinesCauses: 'Possible causes:',
    routinesRls: 'RLS (Row Level Security) blocking anon access',
    routinesBadge: '5 rituals · 5 skin types',

    premiumPlanBadge: 'Monthly plan',
    premiumB1: '100% personalized routine + monthly follow-up',
    premiumB2: 'Priority support on WhatsApp',
    premiumB3: 'Early access to new arrivals',
    premiumB4: 'Priority shipping nationwide',
    premiumSubscribe: 'Subscribe — {price}/mo',

    wishlistRemove: 'Remove from wishlist',
    wishlistSave: 'Save to wishlist',
    productDetails: 'View product details',
    addToOrderAria: 'Add {name} to order',
    quickViewClose: 'Close details',
    quickViewPrev: 'Previous product',
    quickViewNext: 'Next product',
    quickViewZoomTitle: 'Enlarged product image',
    quickViewZoomClose: 'Close enlarged image',
    newArrival: 'New arrival',
    leaveReview: 'Leave a review',
    addedExclaim: 'Added!',
    navClearSearch: 'Clear search',
    navOpenOrder: 'Open my order',
    navOpenOrderItems: 'Open my order, {count} products',
    navChangeLanguage: 'Change language',
    navSwitchTo: 'Switch to {lang}',
    navLanguageHeader: 'Language',
    installHide: 'Hide notice',
    authSignInGoogle: 'Sign in with Google',
    reviewFormClose: 'Close form',
    toastRegion: 'Notifications',
    blogBack: 'Back to blog',
    blogReadingTime: '{minutes} read',
    blogFaqTitle: 'Frequently asked questions',
  },
};
