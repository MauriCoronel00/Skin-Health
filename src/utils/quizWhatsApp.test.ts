import { describe, expect, it } from 'vitest';
import { buildQuizWhatsAppMessage, buildQuizWhatsAppUrl } from './quizWhatsApp';
import { STORE_PHONE_NUMBER } from '../data/products';

const base = {
  routineId: 'manchas-luminosidad',
  skinType: 'mixta',
  concerns: ['poros', 'manchas'],
  routineLevel: 'completa',
  spfHabit: 'salgo',
};

describe('buildQuizWhatsAppMessage', () => {
  it('incluye marcador para el bot y todos los datos', () => {
    const msg = buildQuizWhatsAppMessage(base);
    expect(msg).toContain('*DIAGNÓSTICO WEB*');
    expect(msg).toContain('Piel: Mixta');
    expect(msg).toContain('Poros, Manchas');
    expect(msg).toContain('Nivel: Completa');
    expect(msg).toContain('Solo cuando salgo');
    expect(msg).toContain('Manchas, Hiperpigmentación y Luminosidad');
  });

  it('tolera ids desconocidos y lista vacía', () => {
    const msg = buildQuizWhatsAppMessage({ ...base, routineId: 'x', concerns: [] });
    expect(msg).toContain('Rutina sugerida: x');
    expect(msg).toContain('Preocupaciones: —');
  });
});

describe('buildQuizWhatsAppUrl', () => {
  it('apunta al número de la tienda con texto codificado', () => {
    const url = buildQuizWhatsAppUrl(base);
    expect(url.startsWith(`https://wa.me/${STORE_PHONE_NUMBER}?text=`)).toBe(true);
    expect(url).toContain(encodeURIComponent('*DIAGNÓSTICO WEB*'));
  });
});
