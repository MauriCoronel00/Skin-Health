import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Testimonio {
  id: string;
  author: string;
  city?: string;
  rating: number;
  comment: string;
  productName: string;
}

/** Reseñas destacadas (featured) o últimas aprobadas, con nombre del producto. */
export async function fetchTestimonios(limit = 6): Promise<Testimonio[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, author_name, city, rating, comment, productos ( nombre )')
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('creado_en', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown as {
    id: string;
    author_name: string;
    city: string | null;
    rating: number;
    comment: string;
    productos: { nombre: string } | null;
  }[]).map((r) => ({
    id: r.id,
    author: r.author_name,
    city: r.city ?? undefined,
    rating: r.rating,
    comment: r.comment,
    productName: r.productos?.nombre ?? '',
  }));
}

export const TestimoniosSection: React.FC = () => {
  const [items, setItems] = useState<Testimonio[]>([]);

  useEffect(() => {
    fetchTestimonios()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="text-center mb-6">
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Opiniones reales
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#102A43] mt-2">
          Lo que dicen nuestros clientes
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => (
          <figure
            key={t.id}
            className="bg-white rounded-2xl border border-[#102A43]/10 p-5 shadow-xs flex flex-col"
          >
            <Quote className="w-5 h-5 text-[#102A43]/20 mb-2" />
            <div className="flex items-center gap-0.5 mb-2" aria-label={`${t.rating} de 5 estrellas`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <blockquote className="text-sm text-neutral-700 leading-relaxed flex-1">
              “{t.comment}”
            </blockquote>
            <figcaption className="mt-3 pt-3 border-t border-neutral-100 text-xs">
              <span className="font-semibold text-neutral-900">{t.author}</span>
              {t.city && <span className="text-neutral-400"> · {t.city}</span>}
              {t.productName && (
                <span className="block text-[#102A43]/70 mt-0.5">compró: {t.productName}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
