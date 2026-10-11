import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';

export interface CartItemServer {
  product_id: string;
  quantity: number;
  price_gs: number;
  added_at: string;
}

export interface CartServer {
  id: string;
  device_id: string;
  user_id: string | null;
  items: CartItemServer[];
  updated_at: string;
  created_at: string;
}

/** Obtiene o genera un device_id persistente para usuarios anónimos */
export function getDeviceId(): string {
  const STORAGE_KEY = 'skinhealth_device_id_v1';
  try {
    let deviceId = localStorage.getItem(STORAGE_KEY);
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, deviceId);
    }
    return deviceId;
  } catch {
    // Fallback si localStorage no disponible
    return `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

/** Convierte items del formato servidor al formato cliente */
export function serverItemsToClient(items: CartItemServer[], products: Product[]): Array<{ product: Product; quantity: number }> {
  const productMap = new Map(products.map(p => [p.id, p]));
  return items
    .map(item => {
      const product = productMap.get(item.product_id);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter((x): x is { product: Product; quantity: number } => x !== null);
}

/** Convierte items del formato cliente al formato servidor */
export function clientItemsToServer(items: Array<{ product: Product; quantity: number }>): CartItemServer[] {
  return items.map(item => ({
    product_id: item.product.id,
    quantity: item.quantity,
    price_gs: item.product.price,
    added_at: new Date().toISOString(),
  }));
}

/** Obtiene el carrito del servidor */
export async function fetchCart(deviceId: string, userId: string | null = null): Promise<CartServer | null> {
  const { data, error } = await supabase.rpc('get_cart', {
    p_device_id: deviceId,
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
  return data as CartServer | null;
}

/** Guarda/actualiza el carrito en el servidor */
export async function saveCart(deviceId: string, items: CartItemServer[], userId: string | null = null): Promise<CartServer | null> {
  const { data, error } = await supabase
    .from('carritos')
    .upsert(
      items.map(item => ({
        device_id: deviceId,
        user_id: userId,
        items: item,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'device_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving cart:', error);
    return null;
  }
  return data as CartServer | null;
}

/** Limpia el carrito en el servidor */
export async function clearCartServer(deviceId: string, userId: string | null = null): Promise<void> {
  const { error } = await supabase.rpc('clear_cart', {
    p_device_id: deviceId,
    p_user_id: userId,
  });

  if (error) {
    console.error('Error clearing cart:', error);
  }
}

/** Migra carrito anónimo a usuario autenticado (login) */
export async function migrateCartToUser(deviceId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('carritos')
    .update({ user_id: userId, device_id: null })
    .eq('device_id', deviceId)
    .is('user_id', null);

  if (error) {
    console.error('Error migrating cart:', error);
  }
}

/** Sincroniza carrito local con servidor (merge strategy: server wins for conflicts) */
export async function syncCart(
  deviceId: string,
  localItems: Array<{ product: Product; quantity: number }>,
  products: Product[],
  userId: string | null = null
): Promise<Array<{ product: Product; quantity: number }>> {
  try {
    const serverCart = await fetchCart(deviceId, userId);
    const serverItems = serverCart?.items ?? [];

    if (serverItems.length === 0) {
      // No hay carrito en servidor, subir el local
      await saveCart(deviceId, clientItemsToServer(localItems), userId);
      return localItems;
    }

    // Merge: combinar cantidades, server wins para timestamps
    const merged = new Map<string, CartItemServer>();
    serverItems.forEach(item => merged.set(item.product_id, item));

    localItems.forEach(localItem => {
      const existing = merged.get(localItem.product.id);
      if (existing) {
        // Sumar cantidades, mantener precio del servidor
        merged.set(localItem.product.id, {
          ...existing,
          quantity: existing.quantity + localItem.quantity,
        });
      } else {
        merged.set(localItem.product.id, {
          product_id: localItem.product.id,
          quantity: localItem.quantity,
          price_gs: localItem.product.price,
          added_at: new Date().toISOString(),
        });
      }
    });

    const mergedItems = Array.from(merged.values());
    await saveCart(deviceId, mergedItems, userId);

    return serverItemsToClient(mergedItems, products);
  } catch (error) {
    console.error('Error syncing cart:', error);
    // Fallback: devolver localItems si falla la sincronización
    return localItems;
  }
}