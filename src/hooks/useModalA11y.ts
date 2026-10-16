import { useEffect, useRef } from 'react';

/**
 * Accesibilidad de modales/diálogos: foco inicial, trampa de foco (Tab) y
 * cierre con Escape. Devuelve la ref que hay que poner en el contenedor del
 * diálogo.
 */
export function useModalA11y(isOpen: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Mantener el callback en un ref: si no, un `onClose` con identidad nueva
  // re-ejecutaría el efecto de foco y robaría el foco mientras se escribe.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = ref.current;

    const focusables = (): HTMLElement[] => {
      if (!container) return [];
      return Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
    };

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  return ref;
}
