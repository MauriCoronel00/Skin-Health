import React from 'react';

export const ProductCardSkeleton: React.FC = () => (
  <div className="card-entrance bg-white rounded-2xl p-2 sm:p-3 border border-neutral-100">
    <div className="flex items-center justify-between gap-1 mb-2 h-6">
      <div className="skeleton-text h-4 w-16 rounded-full" />
      <div className="flex items-center gap-0.5">
        <div className="skeleton-avatar w-5 h-5" />
        <div className="skeleton-avatar w-5 h-5" />
      </div>
    </div>
    <div className="skeleton-image aspect-square w-full" />
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="stagger-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const CategoryFilterSkeleton: React.FC = () => (
  <div className="skeleton-btn h-10 w-24 rounded-full mx-auto" />
);

export const HeroBannerSkeleton: React.FC = () => (
  <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br from-[#E8E0D8] to-[#F5F0EB]">
    <div className="absolute inset-0 skeleton-shimmer" />
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="skeleton-text h-6 w-40 rounded mx-auto" />
        <div className="skeleton-text h-10 w-3/4 mx-auto rounded" />
        <div className="skeleton-text h-6 w-1/2 mx-auto rounded" />
        <div className="skeleton-btn h-12 w-48 rounded-full mx-auto mt-4" />
      </div>
    </div>
  </div>
);

export const CategoryPillsSkeleton: React.FC = () => (
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="skeleton-btn h-9 w-28 rounded-full flex-shrink-0" />
    ))}
  </div>
);

export const RoutineCardSkeleton: React.FC = () => (
  <div className="card-entrance bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 flex flex-col h-full">
    <div className="flex items-center gap-3 mb-4">
      <div className="skeleton-avatar w-12 h-12" />
      <div className="flex-1 space-y-1">
        <div className="skeleton-text h-5 w-32 rounded" />
        <div className="skeleton-text h-3 w-20 rounded" />
      </div>
    </div>
    <div className="space-y-3 flex-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton-card p-4 rounded-xl flex items-center gap-3" style={{ height: '72px' }}>
          <div className="skeleton-image w-12 h-12 rounded-lg" />
          <div className="flex-1 space-y-1">
            <div className="skeleton-text h-4 w-24 rounded" />
            <div className="skeleton-text h-3 w-16 rounded" />
          </div>
          <div className="skeleton-btn h-8 w-20 rounded-full" />
        </div>
      ))}
    </div>
    <div className="skeleton-btn h-11 w-full rounded-2xl mt-4" />
  </div>
);

export const RoutinesSectionSkeleton: React.FC = () => (
  <div className="stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
    {Array.from({ length: 3 }).map((_, i) => (
      <RoutineCardSkeleton key={i} />
    ))}
  </div>
);

export const TestimonialSkeleton: React.FC = () => (
  <div className="card-entrance bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col h-full">
    <div className="flex items-center gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-text h-4 w-4 rounded-full" />
      ))}
    </div>
    <div className="skeleton-text h-5 w-full rounded mb-2" />
    <div className="skeleton-text h-5 w-3/4 rounded mb-2" />
    <div className="skeleton-text h-4 w-1/2 rounded mb-4" />
    <div className="flex items-center gap-3">
      <div className="skeleton-avatar w-10 h-10" />
      <div className="flex-1 space-y-1">
        <div className="skeleton-text h-4 w-20 rounded" />
        <div className="skeleton-text h-3 w-16 rounded" />
      </div>
    </div>
  </div>
);

export const TestimoniosSectionSkeleton: React.FC = () => (
  <div className="stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
    {Array.from({ length: 3 }).map((_, i) => (
      <TestimonialSkeleton key={i} />
    ))}
  </div>
);

export const CartItemSkeleton: React.FC = () => (
  <div className="skeleton-card p-3 rounded-xl flex items-start gap-3">
    <div className="skeleton-image w-16 h-16 rounded-xl" />
    <div className="flex-1 space-y-2 min-w-0">
      <div className="flex justify-between">
        <div className="skeleton-text h-3 w-24 rounded" />
        <div className="skeleton-text h-3 w-16 rounded" />
      </div>
      <div className="skeleton-text h-3 w-20 rounded" />
      <div className="flex items-center justify-between">
        <div className="skeleton-btn h-8 w-28 rounded-full" />
        <div className="skeleton-text h-5 w-16 rounded" />
      </div>
    </div>
  </div>
);

export const CartDrawerSkeleton: React.FC = () => (
  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
    <div className="space-y-3">
      <div className="skeleton-text h-5 w-40 rounded" />
      <div className="skeleton-card p-4 rounded-xl">
        <div className="skeleton-text h-5 w-3/4 rounded mb-2" />
        <div className="skeleton-text h-4 w-1/2 rounded mb-2" />
        <div className="skeleton-text h-4 w-1/3 rounded" />
      </div>
      <div className="skeleton-card p-4 rounded-xl">
        <div className="skeleton-text h-5 w-3/4 rounded mb-2" />
        <div className="skeleton-text h-4 w-1/2 rounded mb-2" />
        <div className="skeleton-text h-4 w-1/3 rounded" />
      </div>
    </div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const QuickViewSkeleton: React.FC = () => (
  <div className="relative bg-white w-full max-w-xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="skeleton-image w-48 h-48 sm:w-52 sm:h-52 rounded-2xl" />
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="skeleton-text h-3 w-16 rounded-full" />
            <div className="skeleton-text h-3 w-12 rounded-full ml-auto" />
          </div>
          <div className="skeleton-text h-7 w-3/4 rounded" />
          <div className="skeleton-text h-4 w-1/2 rounded" />
          <div className="skeleton-text h-8 w-28 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="skeleton-text h-3 w-24 rounded" />
        <div className="skeleton-text h-5 w-full rounded" />
        <div className="skeleton-text h-5 w-full rounded" />
      </div>
      <div className="space-y-2">
        <div className="skeleton-text h-3 w-24 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-text h-4 w-full rounded" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="skeleton-text h-3 w-24 rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-text h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="skeleton-card p-4 rounded-xl">
          <div className="skeleton-text h-3 w-16 rounded mb-1" />
          <div className="skeleton-text h-4 w-full rounded" />
        </div>
        <div className="skeleton-card p-4 rounded-xl">
          <div className="skeleton-text h-3 w-16 rounded mb-1" />
          <div className="skeleton-text h-4 w-full rounded" />
        </div>
      </div>
    </div>
    <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-neutral-200 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="skeleton-text h-3 w-24 rounded" />
        <div className="skeleton-text h-7 w-20 rounded" />
      </div>
      <div className="skeleton-btn h-12 w-full max-w-xs rounded-2xl" />
    </div>
  </div>
);