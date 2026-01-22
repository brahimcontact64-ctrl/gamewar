import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryProductsSectionProps {
  category: Category;
  products: Product[];
  limit?: number;
  onAddToCart: (product: Product) => void;
}

export const CategoryProductsSection: React.FC<CategoryProductsSectionProps> = ({
  category,
  products,
  limit = 6,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const displayedProducts = limit ? products.slice(0, limit) : products;
  const categoryName = language === 'ar' ? category.nameAr : category.nameFr;

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gaming-gray flex items-center gap-3">
          {category.icon && (
            <span className="text-4xl">{category.icon}</span>
          )}
          {categoryName}
        </h2>
        {products.length > limit && (
          <Button
            variant="ghost"
            onClick={() => navigate(`/products?category=${category.key}`)}
            className="flex items-center gap-2"
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {products.length > limit && (
        <div className="text-center pt-4">
          <Button
            variant="secondary"
            onClick={() => navigate(`/products?category=${category.key}`)}
            className="flex items-center gap-2 mx-auto"
          >
            Voir les {products.length} produits
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </section>
  );
};
