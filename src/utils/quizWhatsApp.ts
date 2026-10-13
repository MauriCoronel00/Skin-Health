import { STORE_PHONE_NUMBER } from '../data/products';

export interface QuizResultInput {
  routineId: string;
  skinType: string;
  concerns: string[];
  routineLevel: string;
  spfHabit: string;
}

// Etiquetas fijas en español: el mensaje lo lee la tienda/bot, no el cliente.
const ROUTINE_TITLES_ES: Record<string, string> = {
  'piel-grasa': 'Piel Grasa y Tendencia al Acné',
  'hidratacion-sensible': 'Piel Sensible y Barrera Cutánea',
  'manchas-luminosidad': 'Manchas, Hiperpigmentación y Luminosidad',
  'anti-edad-renovacion': 'Anti-Edad y Textura (Renovación)',
  'hidratacion-universal': 'Hidratación Universal',
};

const SKIN_ES: Record<string, string> = {
  grasa: 'Grasa',
  mixta: 'Mixta',
  seca: 'Seca',
  sensible: 'Sensible',
};

const CONCERNS_ES: Record<string, string> = {
  acne: 'Acné',
  poros: 'Poros',
  manchas: 'Manchas',
  lineas: 'Líneas de expresión',
  hidratacion: 'Deshidratación',
  rojez: 'Rojeces',
};

const LEVEL_ES: Record<string, string> = {
  basica: 'Básica',
  completa: 'Completa',
  avanzada: 'Avanzada',
};

const SPF_ES: Record<string, string> = {
  siempre: 'Todos los días',
  salgo: 'Solo cuando salgo',
  maquillaje: 'Solo con maquillaje con SPF',
  nunca: 'Casi nunca',
};

/** Mensaje con el resultado del diagnóstico para que el bot asesore y cierre la venta. */
export function buildQuizWhatsAppMessage(r: QuizResultInput): string {
  return [
    'Hola Skin Health 💙 Completé el *DIAGNÓSTICO WEB* y esta fue mi rutina recomendada:',
    `• Piel: ${SKIN_ES[r.skinType] ?? r.skinType}`,
    `• Preocupaciones: ${r.concerns.length ? r.concerns.map((c) => CONCERNS_ES[c] ?? c).join(', ') : '—'}`,
    `• Nivel: ${LEVEL_ES[r.routineLevel] ?? r.routineLevel}`,
    `• Protector solar: ${SPF_ES[r.spfHabit] ?? r.spfHabit}`,
    `• Rutina sugerida: ${ROUTINE_TITLES_ES[r.routineId] ?? r.routineId}`,
    'Quiero asesoría para armar mi pedido 🙌',
  ].join('\n');
}

/** Link wa.me listo para abrir con el resultado del diagnóstico. */
export function buildQuizWhatsAppUrl(r: QuizResultInput): string {
  return `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(buildQuizWhatsAppMessage(r))}`;
}
