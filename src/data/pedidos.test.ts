import { describe, expect, it } from 'vitest';
import {
  buildPedidoMessage,
  rpcErrorToPedidoError,
  PedidoError,
  PedidoMessageLine,
} from './pedidos';

const lines: PedidoMessageLine[] = [
  { productId: 'a', name: 'Sérum Test', quantity: 2, unitPrice: 100000, lineTotal: 200000 },
];

const base = {
  codigo: 'SKIN-ABC123',
  lines,
  totalGs: 200000,
  nombre: 'Ana',
  telefono: '0991000000',
  direccion: 'Asunción',
};

describe('buildPedidoMessage', () => {
  it('usa TOTAL para pedidos registrados', () => {
    const msg = buildPedidoMessage(base);
    expect(msg).toContain('*TOTAL*');
    expect(msg).not.toContain('ESTIMADO');
    expect(msg).toContain('SKIN-ABC123');
    expect(msg).toContain('Sérum Test x2');
  });

  it('marca TOTAL ESTIMADO en borradores', () => {
    const msg = buildPedidoMessage({ ...base, totalLabel: 'TOTAL ESTIMADO' });
    expect(msg).toContain('*TOTAL ESTIMADO*');
  });
});

describe('rpcErrorToPedidoError', () => {
  it.each([
    ['NO_STOCK: x', 'NO_STOCK'],
    ['UNAVAILABLE: y', 'UNAVAILABLE'],
    ['EMPTY_ORDER', 'CUSTOMER_DATA'],
    ['MISSING_CUSTOMER_DATA', 'CUSTOMER_DATA'],
    ['INVALID_QTY: z', 'ORDER_FAILED'],
    ['boom inesperado', 'ORDER_FAILED'],
  ])('mapea %s a %s', (message, code) => {
    const err = rpcErrorToPedidoError(new Error(message));
    expect(err).toBeInstanceOf(PedidoError);
    expect(err.code).toBe(code);
    expect(err.userMessage.length).toBeGreaterThan(0);
  });
});
