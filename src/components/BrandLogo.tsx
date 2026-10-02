import React from 'react';
import logoClean from '../assets/images/brand_logo_clean.webp';
import logoInverted from '../assets/images/brand_logo_inverted.webp';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  inverted = false,
  className = '',
  variant = 'full',
}) => {
  const iconHeightClass =
    size === 'sm'
      ? 'h-7'
      : size === 'md'
      ? 'h-9 sm:h-10'
      : size === 'lg'
      ? 'h-12'
      : 'h-16';

  const titleSize =
    size === 'sm'
      ? 'text-sm'
      : size === 'md'
      ? 'text-base sm:text-lg'
      : size === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-2xl sm:text-3xl';

  return (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}
      aria-label="Skin Health Logo"
    >
      {/* Official Brand Logo Icon - Direct authentic high-resolution graphic */}
      <img
        src={inverted ? logoInverted : logoClean}
        alt="Skin Health Isotipo Oficial"
        width={66}
        height={96}
        className={`${iconHeightClass} w-auto object-contain shrink-0 transition-transform duration-300 hover:scale-105`}
        loading="eager"
        fetchPriority="high"
      />

      {/* Typography: "SKIN HEALTH" - sin tagline para look más limpio */}
      {variant === 'full' && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-semibold tracking-[0.24em] uppercase font-sans ${titleSize} ${
              inverted ? 'text-white' : 'text-[#102A43]'
            }`}
          >
            SKIN HEALTH
          </span>
        </div>
      )}
    </div>
  );
};
