import { ReviewUser } from '../types';

const GOOGLE_AUTH_STORAGE_KEY = 'skinhealth_google_auth_v1';

export interface GoogleAuthState {
  user: ReviewUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

// Read cached Google profile from sessionStorage
export function getSavedGoogleUser(): ReviewUser | null {
  try {
    const raw = sessionStorage.getItem(GOOGLE_AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return null;
}

// Save Google user to sessionStorage
export function saveGoogleUser(user: ReviewUser): void {
  try {
    sessionStorage.setItem(GOOGLE_AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // fallback
  }
}

// Remove Google user session
export function clearGoogleUser(): void {
  try {
    sessionStorage.removeItem(GOOGLE_AUTH_STORAGE_KEY);
  } catch {
    // fallback
  }
}

// Decode standard Google ID Token (JWT) payload without external heavy library
export function decodeJwtPayload(token: string): {
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
  sub?: string;
} | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.warn('Error parsing Google JWT payload', err);
    return null;
  }
}

// Format date relative or in local format per language
const REVIEW_DATE_TEXT: Record<string, { today: string; yesterday: string; recent: string; days: (n: number) => string; weeks: (n: number) => string; locale: string }> = {
  es: {
    today: 'Hoy',
    yesterday: 'Ayer',
    recent: 'Reciente',
    days: (n) => `Hace ${n} día${n === 1 ? '' : 's'}`,
    weeks: (n) => `Hace ${n} semana${n === 1 ? '' : 's'}`,
    locale: 'es-PY',
  },
  pt: {
    today: 'Hoje',
    yesterday: 'Ontem',
    recent: 'Recentemente',
    days: (n) => `Há ${n} dia${n === 1 ? '' : 's'}`,
    weeks: (n) => `Há ${n} semana${n === 1 ? '' : 's'}`,
    locale: 'pt-BR',
  },
  en: {
    today: 'Today',
    yesterday: 'Yesterday',
    recent: 'Recently',
    days: (n) => `${n} day${n === 1 ? '' : 's'} ago`,
    weeks: (n) => `${n} week${n === 1 ? '' : 's'} ago`,
    locale: 'en-US',
  },
};

export function formatReviewDate(isoString: string, language: string = 'es'): string {
  const L = REVIEW_DATE_TEXT[language] || REVIEW_DATE_TEXT.es;
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return L.recent;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return L.today;
    if (diffDays === 1) return L.yesterday;
    if (diffDays < 7) return L.days(diffDays);
    if (diffDays < 30) return L.weeks(Math.floor(diffDays / 7));

    return date.toLocaleDateString(L.locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return L.recent;
  }
}

// Content moderation helper: checks for offensive words, spam, or malicious URLs
const FORBIDDEN_WORDS = [
  'estafa',
  'estafadores',
  'mierda',
  'basura',
  'puta',
  'pelotudo',
  'fraude',
  'hack',
  'casino',
  'porn',
  'viagra',
  'crypto',
  'bitcoin',
];

export function validateReviewContent(comment: string): { isValid: boolean; message?: string } {
  const trimmed = comment.trim();
  if (trimmed.length > 0 && trimmed.length < 5) {
    return { isValid: false, message: 'El comentario debe tener al menos 5 caracteres si deseas escribir uno.' };
  }
  if (trimmed.length > 600) {
    return { isValid: false, message: 'El comentario no puede exceder los 600 caracteres.' };
  }

  // Detect suspicious links
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|xyz|io|app|ru|tk|biz))/i;
  if (urlPattern.test(trimmed)) {
    return { isValid: false, message: 'Por motivos de seguridad, no está permitido incluir enlaces o links en las opiniones.' };
  }

  // Detect offensive words
  const lower = trimmed.toLowerCase();
  for (const badWord of FORBIDDEN_WORDS) {
    const regex = new RegExp(`\\b${badWord}\\b`, 'i');
    if (regex.test(lower)) {
      return { isValid: false, message: 'Tu reseña contiene términos que no cumplen con nuestras normas comunitarias de respeto.' };
    }
  }

  return { isValid: true };
}
