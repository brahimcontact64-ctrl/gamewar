import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Package } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userProfile) return;

      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userProfile.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userProfile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-primary';
      case 'delivered':
        return 'text-primary';
      case 'cancelled':
        return 'text-accent';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Package className="w-24 h-24 text-gray-400" />
        <p className="text-gray-500 text-xl">{t('noOrders')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gaming-gray mb-6">{t('myOrders')}</h2>

      {orders.map((order) => (
        <Card key={order.id}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                {t('date')}: {order.createdAt.toLocaleDateString()}
              </div>
              <div className={`font-semibold ${getStatusColor(order.status)}`}>
                {t(order.status)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {order.total.toLocaleString()} {t('da')}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gaming-gray">
                  {item.product?.name || 'Product'} x {item.quantity}
                </span>
                <span className="text-gray-500">
                  {((item.product?.price || 0) * item.quantity).toLocaleString()} {t('da')}
                </span>
              </div>
            ))}
          </div>

          {order.deliveryAddress && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
              <div>{t('address')}: {order.deliveryAddress}</div>
              {order.phone && <div>{t('phone')}: {order.phone}</div>}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
