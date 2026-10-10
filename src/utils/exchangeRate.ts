import { useEffect, useState } from 'react';

const STORAGE_KEY = 'skinhealth_dai_exchange_rate';
const STORAGE_TIME_KEY = 'skinhealth_dai_exchange_rate_time';
const CACHE_DURATION = 60 * 1000; // 1 minuto en milisegundos

// Tipos
export type RateSource = 'api' | 'cached' | 'base';

export type ExchangeRate = {
  rate: number; // Cantidad de Gs por 1 USD
  timestamp: number;
  source: RateSource;
};

// Tasa base oficial (Gs por USD) según usuario: 1 USD = 5890 Gs
const BASE_RATE = 5890;

/**
 * Obtiene la cotización actual del dólar Dai
 * - Usa la tasa base oficial de 5890 Gs por USD
 - Cachea en localStorage para evitar llamadas repetidas
 */
export const useExchangeRate = (): ExchangeRate => {
  const [rate, setRate] = useState<ExchangeRate>({
    rate: BASE_RATE,
    timestamp: Date.now(),
    source: 'cached',
  });

  // No es necesario hacer fetch de APIs externas - usamos la tasa oficial
  // que el usuario especificó: 1 USD = 5890 Gs
  // Si en el futuro se necesita una API en tiempo real, se puede integrar aquí.

  return rate;
};

/**
 * Convierte un monto de Guaraníes a USD usando la tasa oficial
 * @param amountGs Monto en Guaraníes
 * @returns Monto en USD redondeado a 2 decimales
 */
export const convertGsToUsd = (amountGs: number): number => {
  if (!amountGs || amountGs <= 0) return 0;
  return Math.round((amountGs / BASE_RATE) * 100) / 100;
};

/**
 * Formatea un precio mostrando Guaraníes y USD convertidos
 * @param amountGs Monto en Guaraníes
 * @param language Idioma: 'es', 'pt' o 'en'
 * @returns String formateado ej: "₲ 1.000 ( $17.03 )"
 */
export const formatPriceDivisa = (
  amountGs: number,
  language: 'es' | 'pt' | 'en'
): string => {
  if (!amountGs || amountGs <= 0) return '--';

  const amountUsd = convertGsToUsd(amountGs);

  // Formato según idioma para Gs
  const formattedGs = new Intl.NumberFormat(language === 'es' ? 'es-PY' : language === 'pt' ? 'pt-BR' : 'en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amountGs);

  // Formato USD
  const formattedUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountUsd);

  // Prefijo según idioma
  const prefix = language === 'es'
    ? '₲'
    : language === 'pt'
    ? 'R$'
    : '$';

  return `${prefix} ${formattedGs} (${formattedUsd})`;
};

/**
 * Obtiene la información de moneda según idioma
 */
export const getCurrencyInfo = (language: 'es' | 'pt' | 'en') => {
  const info = {
    es: { symbol: '₲', name: 'Guaraníes', divisa: 'pyg' },
    pt: { symbol: 'R$', name: 'Reais', divisa: 'brl' },
    en: { symbol: '$', name: 'Dólares', divisa: 'usd' },
  };

  return info[language];
};