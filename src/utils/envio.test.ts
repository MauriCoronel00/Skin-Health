import { describe, expect, it } from 'vitest';
import { calcularEnvio } from './envio';

describe('calcularEnvio', () => {
  it('base 8000 hasta 3 km', () => {
    expect(calcularEnvio(0)).toBe(8000);
    expect(calcularEnvio(1)).toBe(8000);
    expect(calcularEnvio(3)).toBe(8000);
  });

  it('2000 por km desde el 4to', () => {
    expect(calcularEnvio(4)).toBe(10000);
    expect(calcularEnvio(5)).toBe(12000);
    expect(calcularEnvio(10)).toBe(22000);
  });

  it('redondea hacia arriba', () => {
    expect(calcularEnvio(3.2)).toBe(10000);
  });

  it('null con distancia inválida', () => {
    expect(calcularEnvio(null)).toBeNull();
    expect(calcularEnvio(undefined)).toBeNull();
    expect(calcularEnvio(-1)).toBeNull();
    expect(calcularEnvio(NaN)).toBeNull();
  });
});
