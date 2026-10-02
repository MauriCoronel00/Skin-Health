import React, { useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react';
import { BlogPost } from '../data/blog';
import { useProducts } from '../contexts/ProductContext';
import { productImageUrl } from '../data/productImage';
import { formatGuarani } from '../data/products';
import { setBlogSEO, clearBlogSEO } from '../utils/seo';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  onProductClick: (productId: string) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack, onProductClick }) => {
  const { products } = useProducts();

  useEffect(() => {
    setBlogSEO(post);
    return () => clearBlogSEO();
  }, [post]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#102A43] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al blog
      </button>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString('es-PY', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} de lectura
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#102A43] leading-tight mb-4">
            {post.title}
          </h1>
        </header>

        <div className="prose prose-neutral max-w-none">
          {post.sections.map((section, idx) => (
            <section key={idx} className="mb-8">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#102A43] mb-3">
                {section.heading}
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
                {section.body}
              </p>

              {section.products && section.products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  {section.products.map((prod) => {
                    const fullProduct = products.find((p) => p.id === prod.id);
                    return (
                      <button
                        key={prod.id}
                        onClick={() => onProductClick(prod.id)}
                        className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#102A43]/10 hover:border-[#102A43]/30 hover:shadow-sm transition-all text-left cursor-pointer"
                      >
                        {fullProduct && (
                          <img
                            src={productImageUrl(fullProduct.image, 200)}
                            alt={fullProduct.name}
                            className="w-12 h-12 object-contain rounded-lg bg-[#FAF8F5] p-1"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#102A43]/60">
                            {prod.brand}
                          </span>
                          <span className="block text-xs font-semibold text-neutral-800 truncate">
                            {prod.name}
                          </span>
                          {fullProduct && (
                            <span className="text-xs font-bold text-[#102A43]">
                              {formatGuarani(fullProduct.price)}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>

        {post.faq.length > 0 && (
          <section className="mt-10 pt-8 border-t border-[#102A43]/10">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#102A43] mb-4">
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              {post.faq.map((item, idx) => (
                <div key={idx} className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#102A43]/5">
                  <h3 className="font-semibold text-sm text-[#102A43] mb-2">{item.q}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
