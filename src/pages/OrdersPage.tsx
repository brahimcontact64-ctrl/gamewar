import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase/config';
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  FileText,
  MessageCircle,
  Eye,
  X,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';

/* ================= TYPES ================= */
interface UserInfo {
  displayName?: string;
  email?: string;
  phone?: string;
}

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }: { status: string }) => {
  const base = 'px-3 py-1 rounded-full text-xs font-semibold';

  switch (status) {
    case 'pending':
      return <span className={`${base} bg-yellow-600/20 text-yellow-400`}>⏳ En attente</span>;
    case 'confirmed':
      return <span className={`${base} bg-cyan-600/20 text-cyan-400`}>✔ Confirmée</span>;
    case 'delivered':
      return <span className={`${base} bg-green-600/20 text-green-400`}>🚚 Livrée</span>;
    default:
      return <span className={`${base} bg-gray-600/20 text-gray-400`}>—</span>;
  }
};

/* ================= PAGE ================= */
export const OrdersPage: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile, isAdmin } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userProfile) return;

      let ordersData: Order[] = [];

      /* ===== ADMIN ===== */
      if (isAdmin) {
        const snap = await getDocs(query(collection(db, 'orders')));
        ordersData = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate() || new Date(),
        })) as Order[];
      }

      /* ===== CLIENT ===== */
      else {
        // UID
        const snapUid = await getDocs(
          query(collection(db, 'orders'), where('userId', '==', userProfile.uid))
        );

        if (!snapUid.empty) {
          ordersData = snapUid.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate() || new Date(),
          })) as Order[];
        }

        // EMAIL fallback
        else if (userProfile.email) {
          const snapEmail = await getDocs(
            query(collection(db, 'orders'), where('userEmail', '==', userProfile.email))
          );

          ordersData = snapEmail.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate() || new Date(),
          })) as Order[];
        }
      }

      /* ===== SORT SAFE ===== */
      ordersData.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      setOrders(ordersData);

      /* ===== ADMIN USERS ===== */
      if (isAdmin && ordersData.length) {
        const users: Record<string, UserInfo> = {};
        await Promise.all(
          [...new Set(ordersData.map((o) => o.userId))].map(async (uid) => {
            const u = await getDoc(doc(db, 'users', uid));
            if (u.exists()) users[uid] = u.data() as UserInfo;
          })
        );
        setUsersMap(users);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [userProfile, isAdmin]);

  /* ================= ACTIONS ================= */
  const updateStatus = async (orderId: string, status: string) => {
    setActionId(orderId);
    await updateDoc(doc(db, 'orders', orderId), { status });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setActionId(null);
  };

  const generatePdf = async (orderId: string): Promise<string | null> => {
    try {
      const generateInvoice = httpsCallable(functions, 'generateInvoice');
      const res: any = await generateInvoice({ orderId });
      return res.data?.pdfUrl || null;
    } catch {
      return null;
    }
  };

  const sendWhatsAppWithPdf = async (order: Order, user?: UserInfo) => {
    const phone = order.phone || user?.phone;
    if (!phone) return alert('Numéro non disponible');

    setActionId(order.id);
    const pdfUrl = await generatePdf(order.id);
    setActionId(null);

    if (!pdfUrl) return alert('Erreur PDF');

    const msg = `🧾 FACTURE GAMEWAR\nCommande ${order.id.slice(
      0,
      6
    )}\nTotal: ${order.total} DA\n📄 ${pdfUrl}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  };

  /* ================= UI ================= */
  if (loading) {
    return <div className="py-20 text-center text-gaming-green">{t('loading')}</div>;
  }

  if (!orders.length) {
    return (
      <div className="py-20 text-center text-gray-400">
        <Package className="mx-auto w-16 h-16 mb-4" />
        {t('noOrders')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        {isAdmin ? t('allOrders') : t('myOrders')}
      </h1>

      {orders.map((order) => {
        const user = usersMap[order.userId];
        const tva = Math.round(order.total * 0.19);
        const totalTTC = order.total + tva;

        return (
          <Card key={order.id} className="p-5 space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-400 flex gap-2 items-center">
                  <Clock className="w-4 h-4" />
                  {order.createdAt.toLocaleDateString()}
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-gaming-green">
                  {totalTTC.toLocaleString()} DA
                </div>
                <div className="text-xs text-gray-400">
                  HT {order.total} | TVA {tva}
                </div>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              {order.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-300">
                  <span>{i.name} × {i.quantity}</span>
                  <span>{(i.price * i.quantity).toLocaleString()} DA</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t">

  {/* 👁️ تفاصيل الطلب */}
  <Button
    size="sm"
    variant="secondary"
    onClick={() => setSelectedOrder(order)}
  >
    <Eye className="w-4 h-4" /> Détails
  </Button>

  {/* ✅ أزرار الآدمين */}
  {isAdmin && (
    <>
      {order.status === 'pending' && (
        <Button size="sm" onClick={() => updateStatus(order.id, 'confirmed')}>
          <CheckCircle className="w-4 h-4" /> Confirmer
        </Button>
      )}

      {order.status === 'confirmed' && (
        <Button size="sm" onClick={() => updateStatus(order.id, 'delivered')}>
          <Truck className="w-4 h-4" /> Livrée
        </Button>
      )}

      {/* 📄 تحميل الفاتورة PDF */}
      <Button
        size="sm"
        variant="secondary"
        onClick={async () => {
          setActionId(order.id);
          const url = await generatePdf(order.id);
          setActionId(null);
          if (url) window.open(url, '_blank');
        }}
        disabled={actionId === order.id}
      >
        <FileText className="w-4 h-4" /> Télécharger PDF
      </Button>

      {/* 📱 WhatsApp + PDF */}
      <Button
        size="sm"
        variant="secondary"
        onClick={() => sendWhatsAppWithPdf(order, user)}
        disabled={actionId === order.id}
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp + PDF
      </Button>
    </>
  )}
</div>
          </Card>
        );
      })}

      {/* ================= MODAL DETAILS ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gaming-dark p-6 rounded-xl w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Détails commande</h2>
              <button onClick={() => setSelectedOrder(null)}>
                <X />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              {selectedOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.name} × {i.quantity}</span>
                  <span>{(i.price * i.quantity).toLocaleString()} DA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};