import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Search } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useLanguage } from '../contexts/LanguageContext';
import { Product, CartItem } from '../types';
import { useSearchParams } from 'react-router-dom';

interface ProductsPageProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ cart, onAddToCart }) => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { value: 'all', label: t('allCategories') },
    { value: 'controllers', label: t('controllers') },
    { value: 'headsets', label: t('headsets') },
    { value: 'cables', label: t('cables') },
    { value: 'wifi', label: t('wifi') },
    { value: 'accessories', label: t('accessories') },
    { value: 'consoles', label: t('consoles') },
    { value: 'giftCards', label: t('giftCards') },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameAr.includes(searchTerm) ||
      product.descriptionFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descriptionAr.includes(searchTerm);

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gaming-green text-xl">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          options={categories}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
