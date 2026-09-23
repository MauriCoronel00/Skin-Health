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

// Format date relative or in local Spanish format
export function formatReviewDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Reciente';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;

    return date.toLocaleDateString('es-PY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Reciente';
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
