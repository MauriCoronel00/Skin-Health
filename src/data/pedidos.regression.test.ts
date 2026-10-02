import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createPedido,
  PedidoError,
  PedidoErrorCode,
  buildPedidoMessage,
  rpcErrorToPedidoError,
} from './pedidos';

const mockSupabaseRpc = vi.fn();
const mockSupabaseFrom = vi.fn();
const mockSupabaseAuth = vi.fn();

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    rpc: (...args: unknown[]) => mockSupabaseRpc(...args),
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => mockSupabaseFrom(table),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
    auth: {
      getUser: () => mockSupabaseAuth(),
    },
  },
}));

describe('createPedido - validation (unit)', () => {
  const validInput = {
    nombre: 'María Coronel',
    telefono: '0971123456',
    direccion: 'Barrio Herrera, Asunción',
    items: [{ productoId: 'prod-1', cantidad: 2 }],
    costoEnvioGs: 8000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseAuth.mockResolvedValue({ data: { user: null } });
  });

  it('rechaza carrito vacío', async () => {
    await expect(createPedido({ ...validInput, items: [] })).rejects.toThrow(PedidoError);
    await expect(createPedido({ ...validInput, items: [] })).rejects.toMatchObject({
      code: 'EMPTY',
    });
  });

  it('rechaza nombre vacío', async () => {
    await expect(createPedido({ ...validInput, nombre: '   ' })).rejects.toMatchObject({
      code: 'CUSTOMER_DATA',
    });
  });

  it('rechaza dirección vacía', async () => {
    await expect(createPedido({ ...validInput, direccion: '   ' })).rejects.toMatchObject({
      code: 'CUSTOMER_DATA',
    });
  });

  it('rechaza teléfono inválido (< 8 dígitos)', async () => {
    await expect(createPedido({ ...validInput, telefono: '123' })).rejects.toMatchObject({
      code: 'CUSTOMER_DATA',
    });
  });

  it('acepta teléfono con espacios y guiones', async () => {
    mockSupabaseRpc.mockResolvedValue({ data: 'pedido-uuid', error: null });
    mockSupabaseFrom.mockResolvedValue({
      data: { codigo_pedido: 'SKIN-ABC123', total_gs: 200000, costo_envio_gs: 8000 },
      error: null,
    });

    const result = await createPedido({ ...validInput, telefono: '0971 123-456' });
    expect(result.codigo).toBe('SKIN-ABC123');
  });

  it('mapea error NO_STOCK del RPC', async () => {
    mockSupabaseRpc.mockRejectedValue(new Error('NO_STOCK: prod-1'));
    await expect(createPedido(validInput)).rejects.toMatchObject({
      code: 'NO_STOCK',
      userMessage: expect.stringContaining('stock'),
    });
  });

  it('mapea error UNAVAILABLE del RPC', async () => {
    mockSupabaseRpc.mockRejectedValue(new Error('UNAVAILABLE: prod-1'));
    await expect(createPedido(validInput)).rejects.toMatchObject({
      code: 'UNAVAILABLE',
      userMessage: expect.stringContaining('disponible'),
    });
  });

  it('mapea error INVALID_PHONE del RPC', async () => {
    mockSupabaseRpc.mockRejectedValue(new Error('INVALID_PHONE'));
    await expect(createPedido(validInput)).rejects.toMatchObject({
      code: 'CUSTOMER_DATA',
      userMessage: expect.stringContaining('válido'),
    });
  });

  it('mapea error genérico a ORDER_FAILED', async () => {
    mockSupabaseRpc.mockRejectedValue(new Error('random db error'));
    await expect(createPedido(validInput)).rejects.toMatchObject({
      code: 'ORDER_FAILED',
    });
  });

  it('usa total y envío del servidor (no del cliente)', async () => {
    mockSupabaseRpc.mockResolvedValue({ data: 'pedido-uuid', error: null });
    mockSupabaseFrom.mockResolvedValue({
      data: { codigo_pedido: 'SKIN-XYZ', total_gs: 999999, costo_envio_gs: 15000 },
      error: null,
    });

    const result = await createPedido({ ...validInput, costoEnvioGs: 0 });
    expect(result.totalGs).toBe(999999);
    expect(result.costoEnvioGs).toBe(15000);
  });
});

describe('rpcErrorToPedidoError - edge cases', () => {
  it.each([
    ['NO_STOCK: prod-abc', 'NO_STOCK'],
    ['UNAVAILABLE: xyz', 'UNAVAILABLE'],
    ['INVALID_PHONE', 'CUSTOMER_DATA'],
    ['EMPTY_ORDER', 'CUSTOMER_DATA'],
    ['MISSING_CUSTOMER_DATA', 'CUSTOMER_DATA'],
    ['INVALID_QTY: something', 'ORDER_FAILED'],
    ['INVALID_SHIPPING', 'ORDER_FAILED'],
    ['random postgres error', 'ORDER_FAILED'],
    ['', 'ORDER_FAILED'],
  ])('mapea "%s" a código %s', (msg, code) => {
    const err = rpcErrorToPedidoError(new Error(msg));
    expect(err).toBeInstanceOf(PedidoError);
    expect(err.code).toBe(code as PedidoErrorCode);
    expect(err.userMessage.length).toBeGreaterThan(0);
  });
});

describe('buildPedidoMessage - formatting', () => {
  const base = {
    codigo: 'SKIN-TEST123',
    lines: [
      { productId: 'a', name: 'Sérum Test', quantity: 2, unitPrice: 100000, lineTotal: 200000 },
      { productId: 'b', name: 'Crema Hidratante', quantity: 1, unitPrice: 150000, lineTotal: 150000 },
    ],
    totalGs: 350000,
    costoEnvioGs: 10000,
    nombre: 'Ana',
    telefono: '0991000000',
    direccion: 'Asunción',
  };

  it('incluye código, productos, subtotal, envío y total', () => {
    const msg = buildPedidoMessage(base);
    expect(msg).toContain('SKIN-TEST123');
    expect(msg).toContain('Sérum Test x2');
    expect(msg).toContain('Crema Hidratante x1');
    expect(msg).toContain('Subtotal');
    expect(msg).toContain('Envío');
    expect(msg).toContain('TOTAL');
    expect(msg).toContain('₲ 360.000');
  });

  it('marca TOTAL ESTIMADO cuando se pasa totalLabel', () => {
    const msg = buildPedidoMessage({ ...base, totalLabel: 'TOTAL ESTIMADO' });
    expect(msg).toContain('TOTAL ESTIMADO');
    expect(msg).not.toContain('*TOTAL*');
  });

  it('muestra [Por especificar] si faltan datos', () => {
    const msg = buildPedidoMessage({ ...base, nombre: '', telefono: '', direccion: '' });
    expect(msg).toContain('[Por especificar]');
  });

  it('calcula total correcto con envío', () => {
    const msg = buildPedidoMessage({ ...base, costoEnvioGs: 12000 });
    expect(msg).toContain('₲ 362.000');
  });
});