import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  value: number; // 0 to 5
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
};

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  size = 'lg',
  disabled = false,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const starSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  }[size];

  const currentDisplay = hovered !== null ? hovered : value;

  return (
    <div className="flex flex-col items-center sm:items-start gap-1.5">
      <div
        className="flex items-center gap-1.5 focus:outline-none"
        onMouseLeave={() => setHovered(null)}
        role="radiogroup"
        aria-label="Calificación de 1 a 5 estrellas"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= currentDisplay;
          const isHoverActive = hovered !== null && star <= hovered;

          return (
            <motion.button
              key={star}
              type="button"
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.25, rotate: [-2, 2, 0] } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
              transition={{ type: 'spring', stiffness: 450, damping: 17 }}
              onMouseEnter={() => !disabled && setHovered(star)}
              onClick={() => !disabled && onChange(star)}
              className={`p-1 rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/40 ${
                disabled ? 'cursor-not-allowed opacity-60' : ''
              }`}
              aria-label={`${star} estrella${star > 1 ? 's' : ''}: ${RATING_LABELS[star]}`}
            >
              <Star
                className={`${starSizeClasses} transition-all duration-200 ${
                  isFilled
                    ? 'fill-amber-400 stroke-amber-500 text-amber-500 drop-shadow-xs'
                    : 'stroke-neutral-300 fill-transparent text-neutral-300 hover:stroke-amber-300'
                } ${isHoverActive ? 'animate-pulse' : ''}`}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic friendly label */}
      <div className="h-5 flex items-center">
        {currentDisplay > 0 ? (
          <motion.span
            key={currentDisplay}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs font-semibold ${
              currentDisplay >= 4
                ? 'text-emerald-700'
                : currentDisplay === 3
                ? 'text-amber-700'
                : 'text-rose-600'
            }`}
          >
            {currentDisplay} {currentDisplay === 1 ? 'estrella' : 'estrellas'} —{' '}
            <span className="capitalize">{RATING_LABELS[currentDisplay]}</span>
          </motion.span>
        ) : (
          <span className="text-[11px] text-neutral-400 font-normal">
            Toca las estrellas para calificar
          </span>
        )}
      </div>
    </div>
  );
};
