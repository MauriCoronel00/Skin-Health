import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  inverted = false,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 26 : size === 'md' ? 34 : 46;
  const titleSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl';
  const tagSize = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm';

  const navyColor = inverted ? '#FFFFFF' : '#102A43';
  const lightBlueColor = inverted ? '#93C5FD' : '#8EB5D4';
  const gapColor = inverted ? '#0F1E2E' : '#FFFFFF';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Precision Dual-Color Teardrop Icon */}
      <svg
        width={iconSize}
        height={iconSize * 1.2}
        viewBox="0 0 60 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="Skin Health Logo Icon"
      >
        <defs>
          <clipPath id="teardropClip">
            {/* Natural organic droplet contour */}
            <path d="M30 4 C30 4, 6 36, 6 50 C6 62.5 16.5 70 30 70 C43.5 70 54 62.5 54 50 C54 36, 30 4, 30 4 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#teardropClip)">
          {/* Left half - Deep Navy Blue */}
          <path d="M0 0 H35 L12 75 H0 Z" fill={navyColor} />
          {/* Right half - Pastel Sky Blue */}
          <path d="M39 0 H65 V75 H16 Z" fill={lightBlueColor} />
          {/* Diagonal clean cut line */}
          <line
            x1="13"
            y1="73"
            x2="37"
            y2="1"
            stroke={gapColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Brand Typography matching user's identity */}
      <div className="flex flex-col leading-tight">
        <span
          className={`font-semibold tracking-[0.22em] uppercase font-sans ${titleSize} ${
            inverted ? 'text-white' : 'text-[#102A43]'
          }`}
        >
          SKIN HEALTH
        </span>
        {showTagline && (
          <span
            className={`font-normal tracking-wide text-neutral-500 lowercase ${tagSize} ${
              inverted ? 'text-neutral-300' : 'text-[#102A43]/70'
            }`}
          >
            el arte del cuidado de la piel.
          </span>
        )}
      </div>
    </div>
  );
};
