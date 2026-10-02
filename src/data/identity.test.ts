import { beforeEach, describe, expect, it, vi } from 'vitest';
import { currentReviewer } from './identity';
import { getSavedGoogleUser } from '../utils/reviewsStorage';

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    })),
  },
}));

vi.mock('../utils/reviewsStorage', () => ({
  getSavedGoogleUser: vi.fn(),
}));

import { supabase } from '../lib/supabaseClient';

describe('identity.ts - currentReviewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getSavedGoogleUser as vi.Mock).mockReturnValue(null);
  });

  it('devuelve null si no hay sesión ni local', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: null } });
    const reviewer = await currentReviewer();
    expect(reviewer).toBeNull();
  });

  it('usa sesión Supabase si hay usuario', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          user_metadata: { full_name: 'Ana Coronel', avatar_url: 'https://avatar.com/a.jpg' },
        },
      },
    });

    const reviewer = await currentReviewer();
    expect(reviewer).toEqual({
      userId: 'user-123',
      displayName: 'Ana Coronel',
      avatarUrl: 'https://avatar.com/a.jpg',
      source: 'supabase',
    });
  });

  it('usa email como fallback si no hay metadata', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({
      data: { user: { id: 'user-123', email: 'ana@test.com', user_metadata: {} } },
    });

    const reviewer = await currentReviewer();
    expect(reviewer?.displayName).toBe('ana');
  });

  it('fallback a perfiles si no hay metadata', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({
      data: { user: { id: 'user-123', email: 'ana@test.com', user_metadata: {} } },
    });
    (supabase.from as vi.Mock).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { nombre: 'Ana Perfil' }, error: null }),
    });

    const reviewer = await currentReviewer();
    expect(reviewer?.displayName).toBe('Ana Perfil');
  });

  it('usa identidad local si no hay sesión Supabase', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: null } });
    (getSavedGoogleUser as vi.Mock).mockReturnValue({
      name: 'Local User',
      avatarUrl: 'https://local.com/avatar.jpg',
    });

    const reviewer = await currentReviewer();
    expect(reviewer).toEqual({
      userId: null,
      displayName: 'Local User',
      avatarUrl: 'https://local.com/avatar.jpg',
      source: 'local',
    });
  });

  it('prioriza sesión Supabase sobre local', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({
      data: { user: { id: 'supabase-user', email: 'supa@test.com', user_metadata: { full_name: 'Supabase User' } } },
    });
    (getSavedGoogleUser as vi.Mock).mockReturnValue({ name: 'Local User' });

    const reviewer = await currentReviewer();
    expect(reviewer?.displayName).toBe('Supabase User');
    expect(reviewer?.source).toBe('supabase');
  });
});