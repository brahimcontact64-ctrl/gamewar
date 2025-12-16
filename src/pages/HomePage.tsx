import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Headphones,
  Cable,
  Wifi,
  Gift,
  MonitorPlay
} from 'lucide-react';

import { collection, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../contexts/LanguageContext';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  /* ================= CATEGORIES CONFIG ================= */
  const categories = [
    { icon: Gamepad2, key: 'controllers', label: t('controllers') },
    { icon: Headphones, key: 'headsets', label: t('headsets') },
    { icon: Cable, key: 'cables', label: t('cables') },
    { icon: Wifi, key: 'wifi', label: t('wifi') },
    { icon: MonitorPlay, key: 'consoles', label: t('consoles') },
    { icon: Gift, key: 'giftCards', label: t('giftCards') }
  ];

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = orderBy('createdAt', 'desc');
        const snap = await getDocs(collection(db, 'products'));

        const grouped: Record<string, Product[]> = {};

        snap.forEach((doc) => {
          const product = {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          } as Product;

          if (!grouped[product.category]) {
            grouped[product.category] = [];
          }

          grouped[product.category].push(product);
        });

        setProductsByCategory(grouped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= RENDER ================= */
  return (
    <div className="space-y-14">

      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-gaming-darker via-gaming-dark to-gaming-gray rounded-2xl p-12 overflow-hidden">
        <h1 className="text-5xl font-bold text-white mb-4">
          <span className="text-gaming-green">{t('siteName')}</span>
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Votre destination gaming en Algérie
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
          {t('products')}
        </Button>
      </section>

      {/* ================= CATEGORIES ICONS ================= */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">{t('category')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Card
              key={c.key}
              hover
              className="cursor-pointer text-center"
              onClick={() => navigate(`/products?category=${c.key}`)}
            >
              <div className="flex flex-col items-center gap-3 py-4">
                <c.icon className="w-12 h-12 text-gaming-green" />
                <span className="text-white font-semibold">{c.label}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS BY CATEGORY ================= */}
      {loading ? (
        <div className="text-center text-gaming-green text-xl">
          {t('loading')}
        </div>
      ) : (
        categories.map((cat) => {
          const items = productsByCategory[cat.key];
          if (!items || items.length === 0) return null;

          return (
            <section key={cat.key} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {cat.label}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/products?category=${cat.key}`)}
                >
                  {t('viewAll')}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => {}}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
};