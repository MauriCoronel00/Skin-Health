import { ErrorBoundary } from '../ErrorBoundary';
import { CategoryFilter } from '../CategoryFilter';
import { useProducts } from '../../contexts/ProductContext';

export function CategoryChipsSection() {
  const { products, categories, selectedCategory, setSelectedCategory } = useProducts();

  const productCounts: Record<string, number> = {};
  for (const p of products) {
    productCounts[p.category] = (productCounts[p.category] ?? 0) + 1;
  }
  productCounts['all'] = products.length;

  return (
    <ErrorBoundary>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        productCounts={productCounts}
      />
    </ErrorBoundary>
  );
}
