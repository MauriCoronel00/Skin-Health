import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CategoryId, CategoryOption } from '../types';
import { fetchProducts, fetchCategories } from '../data/products';

interface ProductContextValue {
  products: Product[];
  categories: CategoryOption[];
  isLoadingProducts: boolean;
  catalogError: boolean;
  loadCatalog: () => Promise<void>;
  selectedCategory: CategoryId;
  setSelectedCategory: (id: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  selectedSkin: string;
  setSelectedSkin: (s: string) => void;
  selectedPrice: string;
  setSelectedPrice: (p: string) => void;
  filteredProducts: Product[];
  brandOptions: string[];
  productCounts: Record<string, number>;
  resetFilters: () => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

const SKIN_FILTERS: { id: string; label: string; test: RegExp }[] = [
  { id: 'grasa', label: 'Grasa', test: /grasa|brillo/i },
  { id: 'seca', label: 'Seca', test: /seca|deshidratada/i },
  { id: 'mixta', label: 'Mixta', test: /mixta/i },
  { id: 'sensible', label: 'Sensible', test: /sensible|irritada|agredida|recuperaci/i },
];

const PRICE_FILTERS: { id: string; label: string; test: (price: number) => boolean }[] = [
  { id: 'low', label: 'Hasta Gs. 150.000', test: (p) => p <= 150000 },
  { id: 'mid', label: 'Gs. 150.000 – 250.000', test: (p) => p > 150000 && p <= 250000 },
  { id: 'high', label: 'Más de Gs. 250.000', test: (p) => p > 250000 },
];

export { SKIN_FILTERS, PRICE_FILTERS };

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [catalogError, setCatalogError] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSkin, setSelectedSkin] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const loadCatalog = useCallback(async () => {
    setIsLoadingProducts(true);
    setCatalogError(false);
    try {
      const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error cargando el catálogo desde Supabase:', err);
      setCatalogError(true);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCatalog();
  }, [loadCatalog]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;

      if (selectedSkin !== 'all') {
        const skin = product.skinType ?? '';
        const matcher = SKIN_FILTERS.find((f) => f.id === selectedSkin);
        if (matcher && !/todo tipo/i.test(skin) && !matcher.test.test(skin)) return false;
      }

      if (selectedPrice !== 'all') {
        const range = PRICE_FILTERS.find((f) => f.id === selectedPrice);
        if (range && !range.test(product.price ?? 0)) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (product.name ?? '').toLowerCase().includes(query);
        const matchesBrand = (product.brand ?? '').toLowerCase().includes(query);
        const matchesSubtitle = (product.subtitle ?? '').toLowerCase().includes(query);
        const matchesIngredients = (product.keyIngredients ?? []).some((ing) =>
          (ing ?? '').toLowerCase().includes(query)
        );
        return matchesName || matchesBrand || matchesSubtitle || matchesIngredients;
      }

      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery, selectedSkin, selectedPrice]);

  const brandOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.brand) set.add(p.brand);
    }
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const product of products) {
      const key = product.category ?? 'all';
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setSelectedSkin('all');
    setSelectedPrice('all');
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoadingProducts,
        catalogError,
        loadCatalog,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedBrand,
        setSelectedBrand,
        selectedSkin,
        setSelectedSkin,
        selectedPrice,
        setSelectedPrice,
        filteredProducts,
        brandOptions,
        productCounts,
        resetFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de <ProductProvider>');
  return ctx;
};
