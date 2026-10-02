import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, act, screen, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import type { Product } from '../types';

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

describe('CartContext - localStorage persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('carga carrito vacío al inicio', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('total-amount').textContent).toBe('0');
  });

  it('persiste en localStorage al agregar', async () => {
    render(<TestComponent />, { wrapper: Wrapper });
    await act(async () => {
      screen.getByTestId('add-btn').click();
    });
    // Check localStorage directly since jsdom's localStorage works synchronously
    await waitFor(() => {
      const saved = localStorage.getItem('skinhealth_cart_v1');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].product.id).toBe('prod-1');
      expect(parsed[0].quantity).toBe(1);
    }, { timeout: 1000 });
  });

  it('carga carrito guardado en localStorage al montar', () => {
    const savedCart = [{ product: mockProduct, quantity: 3 }];
    localStorage.setItem('skinhealth_cart_v1', JSON.stringify(savedCart));

    render(<TestComponent />, { wrapper: Wrapper });
    expect(screen.getByTestId('total-items').textContent).toBe('3');
    expect(screen.getByTestId('total-amount').textContent).toBe('450000');
  });

  it('maneja localStorage corrupto', () => {
    localStorage.setItem('skinhealth_cart_v1', 'invalid json');
    render(<TestComponent />, { wrapper: Wrapper });
    expect(screen.getByTestId('total-items').textContent).toBe('0');
  });
});

describe('CartContext - addToCart', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
});

describe('CartContext - addMultipleToCart', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
      screen.getByTestId('add-btn').click(); // prod-1 x1
      screen.getByTestId('add-multiple-btn').click(); // prod-1 +1, prod-2 +1
    });
    expect(screen.getByTestId('total-items').textContent).toBe('3');
    expect(screen.getByTestId('quantities').textContent).toContain('"prod-1":2');
    expect(screen.getByTestId('quantities').textContent).toContain('"prod-2":1');
  });
});

describe('CartContext - updateQuantity', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
      screen.getByTestId('add-btn').click(); // qty 2
      screen.getByTestId('dec-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('1');
  });

  it('elimina item si cantidad llega a 0', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('dec-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('cart-items').textContent).toBe('[]');
  });
});

describe('CartContext - removeItem', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('elimina producto completamente', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click();
      screen.getByTestId('add-btn').click();
      screen.getByTestId('remove-btn').click();
    });
    expect(screen.getByTestId('total-items').textContent).toBe('0');
  });
});

describe('CartContext - clearCart', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
});

describe('CartContext - cartQuantities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
});

describe('CartContext - totalAmount calculation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('calcula total correcto con múltiples productos', () => {
    render(<TestComponent />, { wrapper: Wrapper });
    act(() => {
      screen.getByTestId('add-btn').click(); // prod-1 x1 = 150000
      screen.getByTestId('add-multiple-btn').click(); // prod-1 +1, prod-2 +1 = 150000 + 200000
    });
    // Total: prod-1 x2 (300000) + prod-2 x1 (200000) = 500000
    expect(screen.getByTestId('total-amount').textContent).toBe('500000');
  });
});