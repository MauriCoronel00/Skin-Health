import React from 'react';
import { LogIn, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginButton: React.FC = () => {
  const { user, isLoading, signInWithGoogle, signOut } = useAuth();

  if (isLoading) return null;

  if (user) {
    return (
      <button
        onClick={signOut}
        className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-[#102A43] px-3 py-1.5 rounded-full border border-neutral-200 hover:border-[#102A43] transition-colors bg-white"
        title="Cerrar sesión"
      >
        {user.user_metadata?.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt="" className="w-5 h-5 rounded-full" />
        ) : (
          <UserIcon className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">{user.user_metadata?.full_name?.split(' ')[0] || 'Salir'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#102A43]/90 px-3.5 py-1.5 rounded-full transition-colors"
    >
      <LogIn className="w-3.5 h-3.5" />
      <span>Ingresar con Google</span>
    </button>
  );
};
