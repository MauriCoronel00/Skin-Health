import { useEffect, useState } from 'react';

const STORAGE_KEY = 'skinhealth_dai_exchange_rate';
const STORAGE_TIME_KEY = 'skinhealth_dai_exchange_rate_time';
const CACHE_DURATION = 60 * 1000; // 1 minuto en milisegundos

// Tipo para la tasa de cambio
export type ExchangeRate = {
  rate: number; // Cantidad de Gs por 1 USD
  timestamp: number;
  source: 'api' | 'cached' | 'base';
};

// Tasa base fija para desarrollo (aproximado: 1 USD = ~7.800 Gs)
// En producción, esto se obtendría de una API real
const BASE_RATE = 7800;

/**
 * Estados posibles para la fuente de la tasa
 */
export type RateSource = 'api' | 'cached' | 'base';

/**
 * Obtiene la cotización actual del dólar Dai
 * - Primero busca en localStorage si hay una caché reciente
 * - Si no o está expirada, intenta obtener de una API
 * - Si la API falla, usa la tasa base fija
 */
export const useDaiExchangeRate = (): ExchangeRate => {
  const [rate, setRate] = useState<ExchangeRate>({
    rate: BASE_RATE,
    timestamp: 0,
    source: 'cached' as const,
  });

  useEffect(() => {
    const fetchRate = async () => {
      // 1. Intentar leer de localStorage
      const storedRate = localStorage.getItem(STORAGE_KEY);
      const storedTime = localStorage.getItem(STORAGE_TIME_KEY);

      if (storedRate && storedTime) {
        const age = Date.now() - parseInt(storedTime, 10);
        if (age < CACHE_DURATION) {
          // Usar caché válida
          const parsedRate = parseFloat(storedRate);
          setRate({
            rate: isNaN(parsedRate) ? BASE_RATE : parsedRate,
            timestamp: Date.now(),
            source: 'cached',
          });
          return;
        }
      }

      // 2. Intentar obtener de API (usando fetch)
      try {
        // Intentar obtener de múltiples fuentes gratuitas
        let data = null;

        // Fuente 1: API pública de tasas
        try {
          const apiResponse = await fetch(
            'https://api.exchangerate.host/latest?base=PYG&symbols=USD'
          );
          if (apiResponse.ok) {
            const json = await apiResponse.json();
            data = json.rates?.USD;
          }
        } catch (e) {
          // Continuar a siguiente fuente
        }

        // Fuente 2: frankfurter.app
        if (data === undefined || data === null) {
          try {
            const apiResponse = await fetch(
              'https://api.frankfurter.app/latest?from=PYG&to=USD'
            );
            if (apiResponse.ok) {
              const json = await apiResponse.json();
              data = json.result;
            }
          } catch (e) {
            // Continuar
          }
        }

        // Fuente 3: Usar tasa base si todas las APIs fallan
        if (data === undefined || data === null || isNaN(data)) {
          setRate({
            rate: BASE_RATE,
            timestamp: Date.now(),
            source: 'base',
          });
          // Guardar en localStorage para próxima vez
          localStorage.setItem(STORAGE_KEY, BASE_RATE.toString());
          localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
          return;
        }

        // Procesar datos de la API exitosa
        const tasa = data;

        setRate({
          rate: tasa,
          timestamp: Date.now(),
          source: 'api',
        });

        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, tasa.toString());
        localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());

      } catch (error) {
        console.error('Error fetching Dai exchange rate:', error);
        // En caso de error, usar tasa base y guardar en caché
        setRate({
          rate: BASE_RATE,
          timestamp: Date.now(),
          source: 'base',
        });
        localStorage.setItem(STORAGE_KEY, BASE_RATE.toString());
        localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
      }
    };

    fetchRate();

    // Actualizar cada minuto
    const intervalId = setInterval(fetchRate, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return rate;
};

/**
 * Convierte un monto de Guaraníes a USD usando la tasa actual
 */
export const convertGsToUsd = (amount: number, rate: number): number => {
  if (!amount || amount <= 0) return 0;
  return Math.round((amount / rate) * 100) / 100; // Redondeado a 2 decimales
};

/**
 * Formatea un precio mostrando tanto Gs como USD convertidos
 */
export const formatPriceWithRate = (
  amountGs: number,
  language: 'es' | 'pt' | 'en',
  rate: number = BASE_RATE
): string => {
  if (!amountGs || amountGs <= 0) return '--';

  const amountUsd = convertGsToUsd(amountGs, rate);

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

  // Retornar formato: prefijo + Gs + (USD)
  return `${prefix} ${formattedGs} (${formattedUsd})`;
};