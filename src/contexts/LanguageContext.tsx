import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, Translations, GS_PER_USD, GS_PER_BRL } from '../i18n/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  flag: string;
  flagLabel: string;
  currency: string;
  currencyLabel: string;
  formatCurrency: (amount: number) => string;
  dateLocale: string;
  t: Translations;
}

const LOCAL_STORAGE_KEY = 'skinhealth_language_v1';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

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

  const getTranslations = (lang: Language): Translations => translations[lang] || translations.es;
  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      flag: t.flag,
      flagLabel: t.flagLabel,
      currency: t.currency,
      currencyLabel: t.currencyLabel,
      formatCurrency: t.formatCurrency,
      dateLocale: language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-PY',
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageProvider, GS_PER_USD, GS_PER_BRL };
