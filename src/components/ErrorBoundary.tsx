import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function DefaultFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="p-4 text-center text-neutral-500">
      <p className="text-sm">{t.errorSection}</p>
      <button
        onClick={onRetry}
        className="mt-2 text-xs text-[#102A43] underline hover:text-[#102A43]/70 cursor-pointer"
      >
        Reintentar
      </button>
    </div>
  );
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Crash:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <DefaultFallback
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}