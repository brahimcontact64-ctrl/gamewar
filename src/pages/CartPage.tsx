import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
}) => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  /* =======================
     💾 AUTO SAVE CART
  ======================= */
  useEffect(() => {
    if (!userProfile) return;

    const saveCart = async () => {
      const ref = doc(db, 'users', userProfile.uid, 'cart', 'items');
      await setDoc(ref, {
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.product.price,
        })),
        updatedAt: serverTimestamp(),
      });
    };

    saveCart();
  }, [cart, userProfile]);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleQtyChange = (id: string, qty: number, stock: number) => {
    const safeQty = Math.min(stock, Math.max(1, qty));
    setAnimatingId(id);
    onUpdateQuantity(id, safeQty);
    setTimeout(() => setAnimatingId(null), 200);
  };

  const handlePlaceOrder = async () => {
    if (!userProfile || !phone || !address) {
      alert(t('error'));
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: userProfile.uid,
        userName: userProfile.displayName || '',
        userEmail: userProfile.email || '',
        userPhone: phone,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          name:
            language === 'ar'
              ? item.product.nameAr
              : item.product.nameFr,
        })),
        total,
        status: 'pending',
        phone,
        deliveryAddress: address,
        notes,
        createdAt: serverTimestamp(),
      });

      onClearCart();
    } catch (err) {
      console.error(err);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ShoppingBag className="w-24 h-24 text-gray-600 mb-4" />
        <p className="text-gray-400 text-xl">{t('emptyCart')}</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold text-white">{t('cart')}</h2>

        {cart.map((item) => {
          const name =
            language === 'ar'
              ? item.product.nameAr
              : item.product.nameFr;

          const stock = item.product.stock;
          const lowStock = stock <= 5;
          const lastItems = stock <= 3;

          return (
            <Card
              key={item.productId}
              className={`p-4 transition-transform duration-200 ${
                animatingId === item.productId ? 'scale-105' : ''
              }`}
            >
              <div className="flex gap-4">
                {/* IMAGE */}
                <div className="w-24 h-24 bg-gaming-dark rounded-lg overflow-hidden">
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      className="w-full h-full object-cover"
                      alt={name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBag className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{name}</h3>

                  <div className="text-gaming-green font-bold mt-1">
                    {item.product.price.toLocaleString()} {t('da')}
                  </div>

                  {lastItems && (
                    <span className="inline-block mt-1 text-xs bg-red-600 px-2 py-1 rounded">
                      📦 {t('lastItems')}
                    </span>
                  )}

                  {lowStock && !lastItems && (
                    <div className="text-yellow-400 text-xs mt-1">
                      🟡 {t('lowStock')}
                    </div>
                  )}

                  {/* QTY CONTROLS */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        handleQtyChange(
                          item.productId,
                          item.quantity - 1,
                          stock
                        )
                      }
                      className="w-8 h-8 bg-gaming-dark rounded disabled:opacity-40"
                    >
                      <Minus />
                    </button>

                    <Input
                      type="number"
                      min={1}
                      max={stock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQtyChange(
                          item.productId,
                          Number(e.target.value),
                          stock
                        )
                      }
                      className="w-16 text-center"
                    />

                    <button
                      disabled={item.quantity >= stock}
                      onClick={() =>
                        handleQtyChange(
                          item.productId,
                          item.quantity + 1,
                          stock
                        )
                      }
                      className="w-8 h-8 bg-gaming-dark rounded disabled:opacity-40"
                    >
                      <Plus />
                    </button>

                    <button
                      onClick={() => onRemoveFromCart(item.productId)}
                      className="ml-auto text-red-500"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>

                {/* SUBTOTAL */}
                <div className="text-gaming-green font-bold text-lg">
                  {(item.product.price * item.quantity).toLocaleString()} {t('da')}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ================= RIGHT ================= */}
      <div>
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">
            {t('checkout')}
          </h3>

          <div className="space-y-3 mb-6">
            <Input
              type="tel"
              placeholder={t('phone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              placeholder={t('address')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              placeholder={t('notes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="border-t pt-4 mb-6 flex justify-between">
            <span>{t('total')}</span>
            <span className="text-gaming-green font-bold text-2xl">
              {total.toLocaleString()} {t('da')}
            </span>
          </div>

          <Button
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? t('loading') : t('placeOrder')}
          </Button>
        </Card>
      </div>
    </div>
  );
};