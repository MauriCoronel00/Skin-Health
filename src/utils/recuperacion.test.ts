import { describe, expect, it } from 'vitest';
import {
  linkRecuperacion,
  mensajeReactivacion,
  mensajeRecuperacion,
  toWhatsAppNumber,
} from './recuperacion';

describe('toWhatsAppNumber', () => {
  it('convierte 09xx local a 595', () => {
    expect(toWhatsAppNumber('0972800993')).toBe('595972800993');
  });

  it('acepta formato con espacios y guiones', () => {
    expect(toWhatsAppNumber('0972 800-993')).toBe('595972800993');
  });

  it('acepta ya normalizado', () => {
    expect(toWhatsAppNumber('595972800993')).toBe('595972800993');
  });

  it('rechaza teléfonos de prueba e inválidos', () => {
    expect(toWhatsAppNumber('0999999999')).toBe('595999999999');
    expect(toWhatsAppNumber('123')).toBeNull();
    expect(toWhatsAppNumber(null)).toBeNull();
    expect(toWhatsAppNumber('')).toBeNull();
  });
});

describe('mensajes', () => {
  const items = [
    { producto_nombre: 'Effaclar Gel', producto_id: 'a', cantidad: 1, precio_unitario_gs: 219000 },
  ];

  it('recuperación incluye nombre, código y total', () => {
    const msg = mensajeRecuperacion('Mauricio Coronel', 'SH-001', 219000, items);
    expect(msg).toContain('Mauricio');
    expect(msg).toContain('SH-001');
    expect(msg).toContain('₲');
    expect(msg).toContain('Effaclar Gel');
  });

  it('reactivación ofrece asesoría', () => {
    const msg = mensajeReactivacion('Ana', 'SH-002', 149000, items);
    expect(msg).toContain('Ana');
    expect(msg).toContain('asesoramos gratis');
  });

  it('link wa.me codificado', () => {
    const link = linkRecuperacion('0972800993', 'Hola mundo');
    expect(link).toBe('https://wa.me/595972800993?text=Hola%20mundo');
  });

  it('link null con teléfono inválido', () => {
    expect(linkRecuperacion('123', 'Hola')).toBeNull();
  });
});
