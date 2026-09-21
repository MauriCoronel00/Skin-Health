import React, { useEffect, useState } from 'react';
import { Star, Quote, Chrome } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Testimonio {
  id: string;
  author: string;
  city?: string;
  rating: number;
  comment: string;
  productName: string;
}

/** Reseñas destacadas (featured) o últimas aprobadas, con nombre del producto. Obtiene un pool mayor y selecciona 4 aleatorios para diversidad. */
export async function fetchTestimonios(limit = 4): Promise<Testimonio[]> {
  const poolLimit = 12; // pool mayor para diversidad de género
  const { data, error } = await supabase
    .from('reviews')
    .select('id, author_name, city, rating, comment, productos ( nombre )')
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('creado_en', { ascending: false })
    .limit(poolLimit);
  if (error) throw error;
  const all = ((data ?? []) as unknown as {
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
  // Fisher-Yates shuffle para mezcla aleatoria
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, limit);
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
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#102A43] bg-white px-3 py-1 rounded-full border border-[#102A43]/20 flex items-center justify-center gap-1.5 mx-auto">
          <Chrome className="w-3.5 h-3.5 text-[#102A43]" />
          <span>Reseñas de Google</span>
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#102A43] mt-2">
          Lo que dicen nuestros clientes
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {items.slice(0, 4).map((t) => (
          <figure
            key={t.id}
            className="bg-white rounded-2xl border border-[#102A43]/10 p-5 shadow-xs flex flex-col h-full transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <Quote className="w-5 h-5 text-[#102A43]/15" />
              <Chrome className="w-4 h-4 text-[#102A43]/40" title="Reseña de Google" />
            </div>
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
            <blockquote className="text-sm text-neutral-700 leading-relaxed flex-1 min-h-[60px]">
              “{t.comment}”
            </blockquote>
            <figcaption className="mt-3 pt-3 border-t border-neutral-100 text-xs space-y-0.5">
              <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                {t.author}
                {t.city && <span className="text-neutral-400">— {t.city}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};