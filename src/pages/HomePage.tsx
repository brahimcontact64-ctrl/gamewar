import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Headphones, Cable, Wifi, Gift, MonitorPlay, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CategoryProductsSection } from '../components/CategoryProductsSection';
import { useLanguage } from '../contexts/LanguageContext';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../hooks/useSettings';
import { useProductsByCategory } from '../hooks/useProducts';
import { Product } from '../types';

const iconMap: Record<string, React.FC<any>> = {
  Gamepad2,
  Headphones,
  Cable,
  Wifi,
  MonitorPlay,
  Gift,
  Package,
};

interface HomePageProps {
  onAddToCart?: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories(true);
  const { settings } = useSettings();
  const { productsByCategory, loading: productsLoading } = useProductsByCategory(true);

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="space-y-12">
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-white rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden border border-primary/20 shadow-lg">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0icmdiYSg3OSwxOTUsMjQ3LDAuMTUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] opacity-40" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gaming-gray mb-4 leading-tight">
            <span className="text-primary drop-shadow-sm">{settings.storeName}</span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary font-semibold mb-6">
            Votre destination gaming en Algérie
          </p>
          <p className="text-gray-600 mb-8 max-w-2xl leading-relaxed">
            Découvrez une large sélection d'accessoires gaming : manettes Xbox & PS, casques, câbles, adaptateurs WiFi et bien plus. Livraison en Algérie avec paiement à la livraison.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/products')}
            >
              {t('products')}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open(`https://wa.me/${settings.whatsapp}`, '_blank')}
            >
              {t('contactUs')}
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gaming-gray mb-6">{t('category')}</h2>
        {categoriesLoading ? (
          <div className="text-center py-8 text-primary">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon] || Package;
              const categoryName = language === 'ar' ? category.nameAr : category.nameFr;

              return (
                <Card
                  key={category.id}
                  hover
                  className="cursor-pointer text-center group"
                  onClick={() => navigate(`/products?category=${category.key}`)}
                >
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {category.icon && !iconMap[category.icon] ? (
                        <span className="text-3xl">{category.icon}</span>
                      ) : (
                        <IconComponent className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <span className="text-gaming-gray font-semibold">{categoryName}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-12">
        {productsLoading ? (
          <div className="text-center py-12 text-primary">{t('loading')}</div>
        ) : (
          categories.map((category) => {
            const products = productsByCategory.get(category.id) || [];
            return (
              <CategoryProductsSection
                key={category.id}
                category={category}
                products={products}
                limit={6}
                onAddToCart={handleAddToCart}
              />
            );
          })
        )}
      </section>

      <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-primary text-4xl font-bold mb-2">100%</div>
            <div className="text-gaming-gray">Produits Authentiques</div>
          </div>
          <div>
            <div className="text-accent text-4xl font-bold mb-2">24/7</div>
            <div className="text-gaming-gray">Support Client</div>
          </div>
          <div>
            <div className="text-primary text-4xl font-bold mb-2">48H</div>
            <div className="text-gaming-gray">Livraison Rapide</div>
          </div>
        </div>
      </section>
    </div>
  );
};
