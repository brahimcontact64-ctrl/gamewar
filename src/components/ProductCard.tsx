import React from 'react';
import { ShoppingCart, EyeOff, Package } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  const { t, language } = useLanguage();

  // ⛔ حذفنا المتغيرات غير المستعملة
  const { canSeePrices, isGuest } = useAuth();

  const name = language === 'ar' ? product.nameAr : product.nameFr;
  const description =
    language === 'ar' ? product.descriptionAr : product.descriptionFr;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : null;

  return (
    <Card hover className="flex flex-col h-full">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gaming-dark mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-600" />
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-red-500 font-bold text-lg">
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            {canSeePrices ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gaming-green">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-gray-400">{t('da')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <EyeOff className="w-5 h-5" />
                <span className="text-sm">{t('priceHidden')}</span>
              </div>
            )}

            <span
              className={`text-sm ${
                product.stock > 0
                  ? 'text-gaming-cyan'
                  : 'text-red-500'
              }`}
            >
              {product.stock > 0
                ? `${product.stock} ${t('inStock')}`
                : t('outOfStock')}
            </span>
          </div>

          {!canSeePrices && (
            <p className="text-center text-sm text-gaming-cyan mb-3">
              {isGuest
                ? t('createAccountMessage')
                : t('accountActivationRequired')}
            </p>
          )}

          {canSeePrices && product.stock > 0 && (
            <Button
              onClick={() => onAddToCart(product)}
              variant="primary"
              className="w-full"
            >
              <ShoppingCart className="w-4 h-4 inline-block mr-2" />
              {t('addToCart')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};