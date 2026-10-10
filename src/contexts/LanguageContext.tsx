import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'pt' | 'en';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  flag: string;
  flagLabel: string;
  currency: string;
  currencyLabel: string;
  formatCurrency: (amount: number) => string;
}

const LOCAL_STORAGE_KEY = 'skinhealth_language_v1';

const translations = {
  es: {
    flag: '🇵🇾',
    flagLabel: 'PY',
    currency: '₲',
    currencyLabel: 'Guaraníes',
    formatCurrency: (amount: number) => `₲ ${amount.toLocaleString('es-PY')}`,
    brand: 'Marca',
    subtitle: 'Subtítulo',
    brandLabel: 'Marca',
    volumeLabel: 'Volumen',
    searchPlaceholder: 'Buscar producto, marca o ingrediente…',
    cartLabel: 'Pedido',
    routinesTitle: 'Encontrá tu rutina',
    routinesSubtitle: 'Cada rutina son 3 a 4 pasos con productos oficiales',
    announcement: 'Productos 100% originales — Envíos a todo Paraguay',
  },
  pt: {
    flag: '🇧🇷',
    flagLabel: 'BR',
    currency: 'R$',
    currencyLabel: 'Reais',
    formatCurrency: (amount: number) => `R$ ${amount.toLocaleString('pt-BR', {maximumFractionDigits: 0})}`,
    brand: 'Marca',
    subtitle: 'Subtítulo',
    brandLabel: 'Marca',
    volumeLabel: 'Volume',
    searchPlaceholder: 'Buscar produto, marca ou ingrediente…',
    cartLabel: 'Pedido',
    routinesTitle: 'Encontrá tu rutina',
    routinesSubtitle: 'Cada rutina são 3 a 4 passos com produtos oficiais',
    announcement: 'Productos 100% originales — Envíos a todo Paraguay',
  },
  en: {
    flag: '🇺🇸',
    flagLabel: 'US',
    currency: '$',
    currencyLabel: 'USD',
    formatCurrency: (amount: number) => `$ ${amount.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
    brand: 'Brand',
    subtitle: 'Subtitle',
    brandLabel: 'Brand',
    volumeLabel: 'Volume',
    searchPlaceholder: 'Search product, brand or ingredient…',
    cartLabel: 'Cart',
    routinesTitle: 'Find your routine',
    routinesSubtitle: 'Each routine has 3 to 4 steps with official products',
    announcement: '100% original products — Shipping to all Paraguay',
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

LanguageContext.defaultValue = {
  language: 'es',
  setLanguage: () => {},
  flag: '🇵🇾',
  flagLabel: 'PY',
  currency: '₲',
  currencyLabel: 'Guaraníes',
  formatCurrency: (amount: number) => `₲ ${amount.toLocaleString('es-PY')}`,
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY) as Language | null;
    return stored ? stored : 'es';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, language);
  }, [language]);

  const getTranslations = (lang: Language) => translations[lang] || translations.es;

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      flag: getTranslations(language).flag,
      flagLabel: getTranslations(language).flagLabel,
      currency: getTranslations(language).currency,
      currencyLabel: getTranslations(language).currencyLabel,
      formatCurrency: getTranslations(language).formatCurrency,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageProvider };