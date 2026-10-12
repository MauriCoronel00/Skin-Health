import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import { CartItem, Product } from '../types';
import {
  getDeviceId,
  saveCart,
  clearCartServer,
  syncCart,
  migrateCartToUser,
  clientItemsToServer,
} from '../data/cart';

const CART_STORAGE_KEY = 'skinhealth_cart_v1';

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  addMultipleToCart: (products: Product[]) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  cartQuantities: Record<string, number>;
  lastAddedTime: number;
  isSyncing: boolean;
  syncError: string | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadLocalCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore localStorage errors
  }
  return [];
}

function saveLocalCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { products, isLoadingProducts } = useProducts();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedTime, setLastAddedTime] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const deviceId = getDeviceId();
  const userId = user?.id ?? null;
  const isLoggedIn = !!user;

  // Carga inicial: localStorage -> sync con servidor
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      if (authLoading || isLoadingProducts) return;

      const localCart = loadLocalCart();
      setCartItems(localCart);

      try {
        setIsSyncing(true);
        const synced = await syncCart(deviceId, localCart, products, userId);
        if (mounted) {
          setCartItems(synced);
          saveLocalCart(synced);
        }
      } catch (error) {
        console.error('Cart sync failed:', error);
        if (mounted) setSyncError('No se pudo sincronizar el carrito');
      } finally {
        if (mounted) {
          setIsSyncing(false);
          setInitialized(true);
        }
      }
    }

    initialize();

    return () => { mounted = false; };
  }, [authLoading, isLoadingProducts, deviceId, userId]);

  // Migración al hacer login
  useEffect(() => {
    if (isLoggedIn && userId) {
      migrateCartToUser(deviceId, userId).catch(console.error);
    }
  }, [isLoggedIn, userId, deviceId]);

  // Persistencia local (fallback y respuesta inmediata)
  useEffect(() => {
    if (initialized) {
      saveLocalCart(cartItems);
    }
  }, [cartItems, initialized]);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setLastAddedTime(Date.now());
  }, []);

  const addMultipleToCart = useCallback((productsToAdd: Product[]) => {
    setCartItems((prev) => {
      const updated = [...prev];
      for (const prod of productsToAdd) {
        const existingIdx = updated.findIndex((item) => item.product.id === prod.id);
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + 1,
          };
        } else {
          updated.push({ product: prod, quantity: 1 });
        }
      }
      return updated;
    });
    setLastAddedTime(Date.now());
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    clearCartServer(deviceId, userId).catch(console.error);
  }, [deviceId, userId]);

  // Sincronizar con servidor después de cada mutación
  useEffect(() => {
    if (!initialized) return;
    const timeoutId = setTimeout(async () => {
      if (cartItems.length === 0) return;
      try {
        await saveCart(deviceId, clientItemsToServer(cartItems), userId);
      } catch (error) {
        console.error('Failed to save cart to server:', error);
      }
    }, 500); // debounce
    return () => clearTimeout(timeoutId);
  }, [initialized]);

  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const totalAmount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cartItems) {
      map[item.product.id] = item.quantity;
    }
    return map;
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addMultipleToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalAmount,
        cartQuantities,
        lastAddedTime,
        isSyncing,
        syncError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
};