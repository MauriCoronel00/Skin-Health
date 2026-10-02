import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isCurrentUserAdmin, fetchPedidos, fetchPedidoItems, setPedidoEstado, registrarPago, fetchStock, ajustarStock, actualizarPrecio, fetchAuditLog } from './admin';
import type { PedidoEstado } from './admin';

const { mockSupabaseAuth, mockSupabaseFrom, mockSupabaseRpc } = vi.hoisted(() => ({
  mockSupabaseAuth: vi.fn(),
  mockSupabaseFrom: vi.fn(),
  mockSupabaseRpc: vi.fn(),
}));

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: { getUser: mockSupabaseAuth },
    from: mockSupabaseFrom,
    rpc: mockSupabaseRpc,
  },
}));

describe('admin.ts - isCurrentUserAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve false si no hay usuario', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: null } });
    expect(await isCurrentUserAdmin()).toBe(false);
  });

  it('devuelve false si RPC es_admin falla', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSupabaseRpc.mockResolvedValue({ data: false, error: new Error('RPC error') });
    expect(await isCurrentUserAdmin()).toBe(false);
  });

  it('devuelve true si es_admin RPC retorna true', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSupabaseRpc.mockResolvedValue({ data: true, error: null });
    expect(await isCurrentUserAdmin()).toBe(true);
  });
});

describe('admin.ts - fetchPedidos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('obtiene pedidos ordenados por fecha descendente', async () => {
    const mockPedidos = [
      { id: 'p1', codigo_pedido: 'SKIN-1', cliente_nombre: 'Ana', estado: 'pendiente', creado_en: '2024-01-15' },
      { id: 'p2', codigo_pedido: 'SKIN-2', cliente_nombre: 'María', estado: 'pagado', creado_en: '2024-01-14' },
    ];
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockPedidos, error: null }),
    });

    const pedidos = await fetchPedidos();
    expect(pedidos).toHaveLength(2);
    expect(pedidos[0].codigo_pedido).toBe('SKIN-1');
  });

  it('lanza error si falla', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
    });
    await expect(fetchPedidos()).rejects.toThrow('DB error');
  });
});

describe('admin.ts - fetchPedidoItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mapea items con nombre del producto', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [
          { id: 'i1', producto_id: 'prod-1', cantidad: 2, precio_unitario_gs: 150000, productos: { nombre: 'Sérum' } },
          { id: 'i2', producto_id: 'prod-2', cantidad: 1, precio_unitario_gs: 200000, productos: null },
        ],
        error: null,
      }),
    });

    const items = await fetchPedidoItems('p1');
    expect(items).toHaveLength(2);
    expect(items[0].producto_nombre).toBe('Sérum');
    expect(items[1].producto_nombre).toBeUndefined();
  });
});

describe('admin.ts - setPedidoEstado', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'] as PedidoEstado[])('actualiza estado a %s', async (estado) => {
    mockSupabaseFrom.mockReturnValueOnce({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await expect(setPedidoEstado('p1', estado)).resolves.toBeUndefined();
    expect(mockSupabaseFrom).toHaveBeenCalledWith('pedidos');
  });
});

describe('admin.ts - registrarPago', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requiere usuario autenticado', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: null } });
    await expect(registrarPago('p1', {})).rejects.toThrow('NOT_AUTHENTICATED');
  });

  it('actualiza pedido a pagado con referencia y comprobante', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: { id: 'u1', email: 'admin@test.com' } } });
    mockSupabaseFrom.mockReturnValueOnce({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await registrarPago('p1', { referencia: 'REF123', comprobanteUrl: 'https://example.com/comprobante.jpg' });

    const updateCall = mockSupabaseFrom.mock.results[0].value.update.mock.calls[0];
    expect(updateCall[0]).toMatchObject({
      estado: 'pagado',
      referencia_pago: 'REF123',
      comprobante_url: 'https://example.com/comprobante.jpg',
      confirmado_por: 'admin@test.com',
    });
  });

  it('usa user.id si no hay email', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSupabaseFrom.mockReturnValueOnce({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await registrarPago('p1', {});
    const updateCall = mockSupabaseFrom.mock.results[0].value.update.mock.calls[0];
    expect(updateCall[0].confirmado_por).toBe('u1');
  });
});

describe('admin.ts - fetchStock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('obtiene stock ordenado ascendente', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          { id: 'p1', nombre: 'A', marca: 'M', stock: 5, precio_gs: 100000, activo: true },
          { id: 'p2', nombre: 'B', marca: 'M', stock: 10, precio_gs: 200000, activo: false },
        ],
        error: null,
      }),
    });

    const stock = await fetchStock();
    expect(stock).toHaveLength(2);
    expect(stock[0].stock).toBe(5);
    expect(stock[1].stock).toBe(10);
  });
});

describe('admin.ts - ajustarStock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama RPC ajustar_stock y devuelve nuevo stock', async () => {
    mockSupabaseRpc.mockResolvedValue({ data: 25, error: null });
    const newStock = await ajustarStock('prod-1', 25);
    expect(newStock).toBe(25);
    expect(mockSupabaseRpc).toHaveBeenCalledWith('ajustar_stock', {
      p_producto_id: 'prod-1',
      p_nuevo_stock: 25,
    });
  });

  it('lanza error si RPC falla', async () => {
    mockSupabaseRpc.mockResolvedValue({ data: null, error: new Error('Stock error') });
    await expect(ajustarStock('prod-1', 10)).rejects.toThrow('Stock error');
  });
});

describe('admin.ts - actualizarPrecio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lee stock actual y llama RPC con precio nuevo', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { stock: 15 }, error: null }),
    });
    mockSupabaseRpc.mockResolvedValue({ data: null, error: null });

    await actualizarPrecio('prod-1', 180000);

    expect(mockSupabaseRpc).toHaveBeenCalledWith('ajustar_stock', {
      p_producto_id: 'prod-1',
      p_nuevo_stock: 15,
      p_precio_gs: 180000,
    });
  });
});

describe('admin.ts - fetchAuditLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('obtiene log ordenado descendente', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          { id: 'a1', admin_user_id: 'u1', accion: 'create', tabla_objetivo: 'pedidos', realizado_en: '2024-01-15' },
        ],
        error: null,
      }),
    });

    const log = await fetchAuditLog();
    expect(log).toHaveLength(1);
    expect(log[0].accion).toBe('create');
  });
});