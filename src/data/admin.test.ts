import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isCurrentUserAdmin,
  fetchPedidos,
  fetchPedidoItems,
  setPedidoEstado,
  registrarPago,
  fetchStock,
  ajustarStock,
  actualizarPrecio,
  fetchAuditLog,
  fetchProductoAdmin,
  createProducto,
  updateProducto,
  setProductoActivo,
  subirImagenProducto,
} from './admin';
import type { PedidoEstado, ProductoAdmin } from './admin';

const { mockSupabaseAuth, mockSupabaseFrom, mockSupabaseRpc, mockSupabaseStorageFrom } = vi.hoisted(() => ({
  mockSupabaseAuth: vi.fn(),
  mockSupabaseFrom: vi.fn(),
  mockSupabaseRpc: vi.fn(),
  mockSupabaseStorageFrom: vi.fn(),
}));

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: { getUser: mockSupabaseAuth },
    from: mockSupabaseFrom,
    rpc: mockSupabaseRpc,
    storage: { from: mockSupabaseStorageFrom },
  },
}));

/** Builder con todos los métodos encadenables, resuelve en `range`. */
function rangeBuilder(result: { data: unknown; error: unknown }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue(result),
  };
}

/** Builder update().eq().select(). */
function updateBuilder(result: { data: unknown; error: unknown }) {
  return {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue(result),
  };
}

/** Builder delete().eq() sobre producto_beneficios. */
function deleteBuilder(result: { error: unknown } = { error: null }) {
  return {
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue(result),
  };
}

/** Builder insert() sobre producto_beneficios. */
function insertBuilder(result: { error: unknown } = { error: null }) {
  return { insert: vi.fn().mockResolvedValue(result) };
}

describe('admin.ts - isCurrentUserAdmin', () => {
  beforeEach(() => vi.clearAllMocks());

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
  beforeEach(() => vi.clearAllMocks());

  it('pagina y reporta hasMore con limit+1 filas', async () => {
    const rows = [
      { id: 'p1', codigo_pedido: 'SKIN-1', estado: 'pendiente' },
      { id: 'p2', codigo_pedido: 'SKIN-2', estado: 'pagado' },
      { id: 'p3', codigo_pedido: 'SKIN-3', estado: 'pagado' },
    ];
    mockSupabaseFrom.mockReturnValueOnce(rangeBuilder({ data: rows, error: null }));

    const res = await fetchPedidos({ limit: 2 });
    expect(res.rows).toHaveLength(2);
    expect(res.hasMore).toBe(true);
    expect(mockSupabaseFrom).toHaveBeenCalledWith('pedidos');
  });

  it('aplica filtro de estado y búsqueda', async () => {
    const builder = rangeBuilder({ data: [], error: null });
    mockSupabaseFrom.mockReturnValueOnce(builder);

    await fetchPedidos({ estado: 'pagado', search: 'Ana' });
    expect(builder.eq).toHaveBeenCalledWith('estado', 'pagado');
    expect(builder.or).toHaveBeenCalled();
  });

  it('lanza error si falla', async () => {
    mockSupabaseFrom.mockReturnValueOnce(rangeBuilder({ data: null, error: new Error('DB error') }));
    await expect(fetchPedidos()).rejects.toThrow('DB error');
  });
});

describe('admin.ts - fetchPedidoItems', () => {
  beforeEach(() => vi.clearAllMocks());

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
  beforeEach(() => vi.clearAllMocks());

  it.each(['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'] as PedidoEstado[])(
    'actualiza estado a %s',
    async (estado) => {
      mockSupabaseFrom.mockReturnValueOnce(updateBuilder({ data: [{ id: 'p1' }], error: null }));
      await expect(setPedidoEstado('p1', estado)).resolves.toBeUndefined();
      expect(mockSupabaseFrom).toHaveBeenCalledWith('pedidos');
    }
  );

  it('lanza NOT_APPLIED si no se modificó ninguna fila', async () => {
    mockSupabaseFrom.mockReturnValueOnce(updateBuilder({ data: [], error: null }));
    await expect(setPedidoEstado('p1', 'pagado')).rejects.toThrow('NOT_APPLIED');
  });
});

describe('admin.ts - registrarPago', () => {
  beforeEach(() => vi.clearAllMocks());

  it('requiere usuario autenticado', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: null } });
    await expect(registrarPago('p1', {})).rejects.toThrow('NOT_AUTHENTICATED');
  });

  it('actualiza pedido a pagado con referencia y comprobante', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: { id: 'u1', email: 'admin@test.com' } } });
    mockSupabaseFrom.mockReturnValueOnce(updateBuilder({ data: [{ id: 'p1' }], error: null }));

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
    mockSupabaseFrom.mockReturnValueOnce(updateBuilder({ data: [{ id: 'p1' }], error: null }));

    await registrarPago('p1', {});
    const updateCall = mockSupabaseFrom.mock.results[0].value.update.mock.calls[0];
    expect(updateCall[0].confirmado_por).toBe('u1');
  });

  it('lanza NOT_APPLIED si la RLS bloqueó el update', async () => {
    mockSupabaseAuth.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSupabaseFrom.mockReturnValueOnce(updateBuilder({ data: [], error: null }));
    await expect(registrarPago('p1', {})).rejects.toThrow('NOT_APPLIED');
  });
});

describe('admin.ts - fetchStock', () => {
  beforeEach(() => vi.clearAllMocks());

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
  });
});

describe('admin.ts - ajustarStock', () => {
  beforeEach(() => vi.clearAllMocks());

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
  beforeEach(() => vi.clearAllMocks());

  it('llama el RPC de precio sin tocar stock', async () => {
    mockSupabaseRpc.mockResolvedValue({ data: null, error: null });
    await actualizarPrecio('prod-1', 180000);
    expect(mockSupabaseRpc).toHaveBeenCalledWith('actualizar_precio_producto', {
      p_producto_id: 'prod-1',
      p_precio_gs: 180000,
    });
  });

  it('lanza error si el RPC falla', async () => {
    mockSupabaseRpc.mockResolvedValue({ data: null, error: new Error('INVALID_PRICE') });
    await expect(actualizarPrecio('prod-1', 0)).rejects.toThrow('INVALID_PRICE');
  });
});

describe('admin.ts - fetchAuditLog', () => {
  beforeEach(() => vi.clearAllMocks());

  it('obtiene log ordenado descendente y limitado', async () => {
    mockSupabaseFrom.mockReturnValueOnce(
      rangeBuilder({ data: [{ id: 'a1', accion: 'create', tabla_objetivo: 'pedidos' }], error: null })
    );
    const log = await fetchAuditLog(10);
    expect(log).toHaveLength(1);
    expect(log[0].accion).toBe('create');
  });
});

describe('admin.ts - CRUD de productos', () => {
  const producto: ProductoAdmin = {
    id: 'nuevo-serum',
    nombre: 'Nuevo Serum',
    marca: 'MarcaX',
    subtitle: '',
    categoria_id: 'hydrate',
    categoria_label: 'Hidratar',
    precio_gs: 150000,
    stock: 5,
    volumen: '30ml',
    badge: '',
    descripcion: 'desc',
    key_ingredients: 'agua',
    skin_type: 'normal',
    how_to_use: 'usar',
    imagen_url: '',
    activo: true,
    beneficios: [{ titulo: 'Suave', descripcion: 'no irrita', orden: 0 }],
  };

  beforeEach(() => vi.clearAllMocks());

  it('fetchProductoAdmin mapea beneficios y activo', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 'x',
          nombre: 'X',
          marca: 'Y',
          subtitle: null,
          categoria_id: 'hydrate',
          categoria_label: 'Hidratar',
          precio_gs: 100,
          stock: 2,
          volumen: null,
          badge: null,
          descripcion: null,
          key_ingredients: null,
          skin_type: null,
          how_to_use: null,
          imagen_url: null,
          activo: false,
          producto_beneficios: [{ titulo: 'A', descripcion: 'B', orden: 1 }],
        },
        error: null,
      }),
    });

    const p = await fetchProductoAdmin('x');
    expect(p.activo).toBe(false);
    expect(p.beneficios).toHaveLength(1);
    expect(p.subtitle).toBe('');
  });

  it('createProducto inserta el producto y sincroniza beneficios', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const del = deleteBuilder();
    const benInsert = insertBuilder();
    mockSupabaseFrom
      .mockReturnValueOnce({ insert })
      .mockReturnValueOnce(del)
      .mockReturnValueOnce(benInsert);

    await createProducto(producto);

    expect(mockSupabaseFrom).toHaveBeenNthCalledWith(1, 'productos');
    expect(mockSupabaseFrom).toHaveBeenNthCalledWith(2, 'producto_beneficios');
    expect(insert.mock.calls[0][0].id).toBe('nuevo-serum');
    expect(insert.mock.calls[0][0].producto_beneficios_es).toHaveLength(1);
    expect(del.eq).toHaveBeenCalledWith('producto_id', 'nuevo-serum');
    expect(benInsert.insert.mock.calls[0][0][0]).toMatchObject({
      producto_id: 'nuevo-serum',
      titulo: 'Suave',
    });
  });

  it('createProducto sin beneficios no inserta filas en la tabla', async () => {
    mockSupabaseFrom
      .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) })
      .mockReturnValueOnce(deleteBuilder());

    await createProducto({ ...producto, beneficios: [] });
    expect(mockSupabaseFrom).toHaveBeenCalledTimes(2);
  });

  it('updateProducto lanza NOT_APPLIED si no afectó filas', async () => {
    mockSupabaseFrom.mockReturnValueOnce(updateBuilder({ data: [], error: null }));
    await expect(updateProducto('x', producto)).rejects.toThrow('NOT_APPLIED');
  });

  it('updateProducto reemplaza beneficios existentes', async () => {
    const benInsert = insertBuilder();
    mockSupabaseFrom
      .mockReturnValueOnce(updateBuilder({ data: [{ id: 'x' }], error: null }))
      .mockReturnValueOnce(deleteBuilder())
      .mockReturnValueOnce(benInsert);

    await updateProducto('x', producto);
    expect(mockSupabaseFrom).toHaveBeenNthCalledWith(3, 'producto_beneficios');
    expect(benInsert.insert).toHaveBeenCalledTimes(1);
  });

  it('setProductoActivo actualiza activo', async () => {
    mockSupabaseFrom.mockReturnValueOnce(updateBuilder({ data: [{ id: 'x' }], error: null }));
    await setProductoActivo('x', false);
    const call = mockSupabaseFrom.mock.results[0].value.update.mock.calls[0];
    expect(call[0]).toEqual({ activo: false });
  });
});

describe('admin.ts - subirImagenProducto', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sube al bucket publico y devuelve la URL', async () => {
    const upload = vi.fn().mockResolvedValue({ error: null });
    const getPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/x.jpg' } });
    mockSupabaseStorageFrom.mockReturnValue({ upload, getPublicUrl });

    const file = new File(['bytes'], 'foto.jpg', { type: 'image/jpeg' });
    const url = await subirImagenProducto(file);

    expect(url).toBe('https://cdn.example.com/x.jpg');
    expect(mockSupabaseStorageFrom).toHaveBeenCalledWith('Imagenes-Productos');
    const path = upload.mock.calls[0][0] as string;
    expect(path).toMatch(/^skin-health-imagenes\/[0-9a-f-]+\.jpg$/);
  });

  it('rechaza tipo de archivo no permitido', async () => {
    const file = { type: 'image/gif', size: 100 } as unknown as File;
    await expect(subirImagenProducto(file)).rejects.toThrow('INVALID_FILE_TYPE');
  });

  it('rechaza archivos mayores a 5 MB', async () => {
    const file = { type: 'image/png', size: 6 * 1024 * 1024 } as unknown as File;
    await expect(subirImagenProducto(file)).rejects.toThrow('FILE_TOO_LARGE');
  });

  it('lanza el error de storage si la subida falla', async () => {
    const upload = vi.fn().mockResolvedValue({ error: new Error('RLS blocked') });
    mockSupabaseStorageFrom.mockReturnValue({ upload, getPublicUrl: vi.fn() });
    const file = new File(['bytes'], 'foto.png', { type: 'image/png' });
    await expect(subirImagenProducto(file)).rejects.toThrow('RLS blocked');
  });
});
