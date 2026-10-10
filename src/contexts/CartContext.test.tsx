import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, act, screen } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import type { Product } from '../types';

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

// Mock ProductContext
vi.mock('../contexts/ProductContext', () => ({
  useProducts: () => ({ products: [], isLoadingProducts: false }),
}));

// Mock cart data functions
vi.mock('../data/cart', () => ({
  getDeviceId: () => 'test-device-id',
  saveCart: vi.fn().mockResolvedValue(null),
  clearCartServer: vi.fn().mockResolvedValue(undefined),
  syncCart: vi.fn().mockImplementation(async (_deviceId, localItems) => localItems),
  migrateCartToUser: vi.fn().mockResolvedValue(undefined),
  clientItemsToServer: vi.fn().mockImplementation((items) => items.map(i => ({
    product_id: i.product.id,
    quantity: i.quantity,
    price_gs: i.product.price,
    added_at: new Date().toISOString(),
  }))),
}));

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Sérum Test',
  brand: 'TestBrand',
  subtitle: '',
  category: 'hydrate',
  categoryLabel: 'Hidratación',
  price: 150000,
  image: 'https://example.com/img.jpg',
  volume: '30ml',
  badge: 'NUEVO',
  rating: 4.5,
  reviewsCount: 10,
  description: '',
  benefits: [],
  keyIngredients: [],
  skinType: 'todo tipo',
  howToUse: '',
};

const mockProduct2: Product = { ...mockProduct, id: 'prod-2', name: 'Crema Test', price: 200000 };

function TestComponent() {
  const { cartItems, addToCart, addMultipleToCart, updateQuantity, removeItem, clearCart, totalItems, totalAmount, cartQuantities, lastAddedTime } = useCart();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-amount">{totalAmount}</span>
      <span data-testid="cart-items">{JSON.stringify(cartItems)}</span>
      <span data-testid="last-added">{lastAddedTime}</span>
      <button onClick={() => addToCart(mockProduct)} data-testid="add-btn">Add</button>
      <button onClick={() => addMultipleToCart([mockProduct, mockProduct2])} data-testid="add-multiple-btn">Add Multiple</button>
      <button onClick={() => updateQuantity('prod-1', 1)} data-testid="inc-btn">Inc</button>
      <button onClick={() => updateQuantity('prod-1', -1)} data-testid="dec-btn">Dec</button>
      <button onClick={() => removeItem('prod-1')} data-testid="remove-btn">Remove</button>
      <button onClick={clearCart} data-testid="clear-btn">Clear</button>
      <span data-testid="quantities">{JSON.stringify(cartQuantities)}</span>
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

// Reset localStorage before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

describe('CartContext - basic', () => {
  it('carga carrito vacío al inicio', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('total-amount').textContent).toBe('0');
  });

  it('agrega producto nuevo con cantidad 1', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('total-amount').textContent).toBe('150000');
  });

  it('incrementa cantidad si producto ya existe', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('2');
    expect(screen.getByTestId('total-amount').textContent).toBe('300000');
  });

  it('actualiza lastAddedTime', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    const before = Date.now();
    act(() => {
      screen.getByTestId('add-btn').click();
    });
    const after = Date.now();
    const lastAdded = Number(screen.getByTestId('last-added').textContent);
    expect(lastAdded).toBeGreaterThanOrEqual(before);
    expect(lastAdded).toBeLessThanOrEqual(after);
  });

  it('agrega múltiples productos', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-multiple-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('2');
    expect(screen.getByTestId('total-amount').textContent).toBe('350000');
  });

  it('incrementa existentes y agrega nuevos', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-multiple-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('3');
    expect(screen.getByTestId('quantities').textContent).toContain('"prod-1":2');
    expect(screen.getByTestId('quantities').textContent).toContain('"prod-2":1');
  });

  it('incrementa cantidad', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('inc-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('2');
  });

  it('decrementa cantidad', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-btn').click();
      screen.getByTestId('dec-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('1');
  });

  it('elimina item cuando cantidad llega a 0', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-btn').click();
      screen.getByTestId('dec-btn').click();
      screen.getByTestId('dec-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('cart-items').textContent).toBe('[]');
  });

  it('vacía el carrito', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-multiple-btn').click();
      screen.getByTestId('clear-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('total-amount').textContent).toBe('0');
  });

  it('devuelve mapa de cantidades por productId', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-multiple-btn').click();
    });
    const quantities = JSON.parse(screen.getByTestId('quantities').textContent);
    expect(quantities['prod-1']).toBe(3);
    expect(quantities['prod-2']).toBe(1);
  });

  it('calcula total correcto con múltiples productos', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-multiple-btn').click();
    });
    expect(screen.getByTestId('total-amount').textContent).toBe('500000');
  });
});