import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!userProfile || !phone || !address) {
      alert(t('error'));
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: userProfile.uid,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          name: language === 'ar' ? item.product.nameAr : item.product.nameFr,
        })),
        total,
        status: 'pending',
        phone,
        deliveryAddress: address,
        notes,
        createdAt: serverTimestamp(),
      });

      alert(t('orderPlaced'));
      onClearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ShoppingBag className="w-24 h-24 text-gray-600" />
        <p className="text-gray-400 text-xl">{t('emptyCart')}</p>
        <Button onClick={() => navigate('/products')}>{t('products')}</Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold text-gaming-gray mb-4">{t('cart')}</h2>
        {cart.map((item) => {
          const name = language === 'ar' ? item.product.nameAr : item.product.nameFr;
          return (
            <Card key={item.productId}>
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gaming-gray mb-2">{name}</h3>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-primary font-bold">
                      {item.product.price.toLocaleString()} {t('da')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gaming-gray hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-gaming-gray font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            Math.min(item.product.stock, item.quantity + 1)
                          )
                        }
                        className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gaming-gray hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveFromCart(item.productId)}
                      className="ml-auto text-accent hover:text-accent-dark transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <Card>
          <h3 className="text-xl font-bold text-gaming-gray mb-4">{t('checkout')}</h3>

          <div className="space-y-4 mb-6">
            <Input
              type="tel"
              placeholder={t('phone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder={t('address')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder={t('notes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-500">{t('total')}</span>
              <span className="text-primary font-bold text-2xl">
                {total.toLocaleString()} {t('da')}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={loading || !phone || !address}
          >
            {loading ? t('loading') : t('placeOrder')}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">{t('cashOnDelivery')}</p>
        </Card>
      </div>
    </div>
  );
};
