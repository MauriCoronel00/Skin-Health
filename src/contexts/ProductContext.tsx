import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CategoryId, CategoryOption } from '../types';
import { fetchProducts, fetchCategories } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import { Translations } from '../i18n/translations';

interface ProductContextValue {
  products: Product[];
  categories: CategoryOption[];
  isLoadingProducts: boolean;
  catalogError: boolean;
  loadCatalog: (language?: 'es' | 'pt' | 'en') => Promise<void>;
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

const getSkinFilters = (t: Translations): { id: string; label: string; test: RegExp }[] => [
  { id: 'grasa', label: t.skinGrasa, test: /grasa|brillo/i },
  { id: 'seca', label: t.skinSeca, test: /seca|deshidratada/i },
  { id: 'mixta', label: t.skinMixta, test: /mixta/i },
  { id: 'sensible', label: t.skinSensible, test: /sensible|irritada|agredida|recuperaci/i },
];

const getPriceFilters = (
  t: Translations,
  formatCurrency: (amount: number) => string
): { id: string; label: string; test: (price: number) => boolean }[] => [
  { id: 'low', label: `${t.priceUpTo} ${formatCurrency(150000)}`, test: (p) => p <= 150000 },
  { id: 'mid', label: `${formatCurrency(150000)} – ${formatCurrency(250000)}`, test: (p) => p > 150000 && p <= 250000 },
  { id: 'high', label: `${t.priceOver} ${formatCurrency(250000)}`, test: (p) => p > 250000 },
];

export { getSkinFilters, getPriceFilters };

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const { language, t, formatCurrency } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSkin, setSelectedSkin] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const loadCatalog = useCallback(async (language: 'es' | 'pt' | 'en' = 'es') => {
    setIsLoadingProducts(true);
    setCatalogError(false);
    try {
      const [prods, cats] = await Promise.all([fetchProducts(language), fetchCategories(language)]);
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
    void loadCatalog(language);
  }, [language, loadCatalog]);

  useEffect(() => {
    const handleLanguageChange = () => {
      void loadCatalog(language);
    };
    // El idioma ya viene del contexto, no necesito suscribirme a cambios adicionales
    // ya que language ya viene de useLanguage() arriba
  }, [language]);

  const filteredProducts = useMemo(() => {
    const skinFilters = getSkinFilters(t);
    const priceFilters = getPriceFilters(t, formatCurrency);
    return products.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;

      if (selectedSkin !== 'all') {
        const skin = product.skinType ?? '';
        const matcher = skinFilters.find((f) => f.id === selectedSkin);
        if (matcher && !/todo tipo/i.test(skin) && !matcher.test.test(skin)) return false;
      }

      if (selectedPrice !== 'all') {
        const range = priceFilters.find((f) => f.id === selectedPrice);
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
  }, [products, selectedCategory, selectedBrand, searchQuery, selectedSkin, selectedPrice, t, formatCurrency]);

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