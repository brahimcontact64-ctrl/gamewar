import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  runTransaction,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';
import { Users, Package, Upload, X, Save, History, Search, Filter, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { ToastContainer } from '../components/ui/Toast';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Product, UserRole, UserStatus, StockHistoryEntry, Order } from '../types';


export const AdminPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'stock'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showStockHistoryModal, setShowStockHistoryModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductHistory, setSelectedProductHistory] = useState<StockHistoryEntry[]>([]);

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');
  const [newUserCredit, setNewUserCredit] = useState(0);

  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState('');

  const [productForm, setProductForm] = useState({
    nameFr: '',
    nameAr: '',
    descriptionFr: '',
    descriptionAr: '',
    price: 0,
    stock: 0,
    category: 'controllers',
    images: [''],
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [stockUpdates, setStockUpdates] = useState<{ [key: string]: number }>({});
  const [savingStock, setSavingStock] = useState<{ [key: string]: boolean }>({});
  const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'ok' | 'low' | 'out'>('all');

  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    fetchData();
    fetchOrderCounts();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersSnap, productsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'))),
      ]);

      setUsers(
        usersSnap.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as User[]
      );

      const productsData = productsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        stockHistory: (doc.data().stockHistory || []).map((entry: any) => ({
          ...entry,
          updatedAt: entry.updatedAt?.toDate() || new Date(),
        })),
      })) as unknown as Product[];

      setProducts(productsData);

      const initialStockUpdates: { [key: string]: number } = {};
      productsData.forEach((product) => {
        initialStockUpdates[product.id] = product.stock;
      });
      setStockUpdates(initialStockUpdates);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderCounts = async () => {
    try {
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const orders = ordersSnap.docs.map((doc) => doc.data()) as Order[];

      const counts: { [key: string]: number } = {};

      orders.forEach((order) => {
        order.items.forEach((item) => {
          counts[item.productId] = (counts[item.productId] || 0) + 1;
        });
      });

      setOrderCounts(counts);
    } catch (error) {
      console.error('Error fetching order counts:', error);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserDisplayName || !newUserPhone) {
      addToast('Tous les champs sont requis', 'error');
      return;
    }

    try {
      const adminEmail = auth.currentUser?.email;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUserEmail,
        newUserPassword
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: newUserDisplayName,
        email: newUserEmail,
        phone: newUserPhone,
        role: newUserRole,
        status: 'active',
        credit: newUserCredit,
        createdAt: serverTimestamp(),
      });

      if (adminEmail && adminPassword) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      }

      addToast('Utilisateur créé avec succès');
      setShowUserModal(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserDisplayName('');
      setNewUserPhone('');
      setNewUserRole('user');
      setNewUserCredit(0);
      fetchData();
    } catch (error: any) {
      console.error('Error creating user:', error);
      addToast(error.message, 'error');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: UserRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role });
      fetchData();
      addToast('Rôle mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user role:', error);
      addToast('Erreur lors de la mise à jour du rôle', 'error');
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), { status });
      fetchData();
      addToast('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user:', error);
      addToast('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const handleAdjustCredit = async () => {
    if (!selectedUser) return;

    try {
      const newCredit = selectedUser.credit + creditAmount;
      await updateDoc(doc(db, 'users', selectedUser.uid), { credit: newCredit });

      await addDoc(collection(db, 'credit_logs'), {
        userId: selectedUser.uid,
        amount: creditAmount,
        type: 'admin_adjustment',
        reason: creditReason,
        createdAt: serverTimestamp(),
      });

      addToast('Crédit ajusté avec succès');
      setShowCreditModal(false);
      setCreditAmount(0);
      setCreditReason('');
      fetchData();
    } catch (error) {
      console.error('Error adjusting credit:', error);
      addToast('Erreur lors de l\'ajustement du crédit', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);

      const productId = selectedProduct?.id || 'temp';
      const timestamp = Date.now();
      const storageRef = ref(
        storage,
        `products/${productId}/${timestamp}_${file.name}`
      );

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setProductForm({ ...productForm, images: [downloadURL] });
      setImagePreview(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      addToast('Erreur lors du téléchargement de l\'image', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (selectedProduct) {
        await updateDoc(doc(db, 'products', selectedProduct.id), {
          ...productForm,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productForm,
          stockHistory: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      addToast('Produit sauvegardé avec succès');
      setShowProductModal(false);
      resetProductForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      addToast('Erreur lors de la sauvegarde du produit', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      fetchData();
      addToast('Produit supprimé avec succès');
    } catch (error) {
      console.error('Error deleting product:', error);
      addToast('Erreur lors de la suppression du produit', 'error');
    }
  };

  const handleSaveStock = async (productId: string) => {
    try {
      setSavingStock({ ...savingStock, [productId]: true });

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const previousStock = product.stock;
      const newStock = stockUpdates[productId];

      if (previousStock === newStock) {
        addToast('Aucun changement à sauvegarder', 'warning');
        setSavingStock({ ...savingStock, [productId]: false });
        return;
      }

      const historyEntry: StockHistoryEntry = {
        previousStock,
        newStock,
        updatedAt: new Date(),
        updatedBy: auth.currentUser?.email || 'unknown',
      };

      const existingHistory = product.stockHistory || [];
      const updatedHistory = [...existingHistory, historyEntry];

      await updateDoc(doc(db, 'products', productId), {
        stock: newStock,
        stockHistory: updatedHistory.map((entry) => ({
          ...entry,
          updatedAt: entry.updatedAt,
        })),
        updatedAt: serverTimestamp(),
      });

      await fetchData();
      addToast('Stock mis à jour avec succès');
    } catch (error) {
      console.error('Error updating stock:', error);
      addToast('Erreur lors de la mise à jour du stock', 'error');
    } finally {
      setSavingStock({ ...savingStock, [productId]: false });
    }
  };

  const handleStockChange = (productId: string, value: number) => {
    setStockUpdates({
      ...stockUpdates,
      [productId]: Math.max(0, value),
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'out';
    if (stock <= 3) return 'low';
    return 'ok';
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
          Rupture de stock
        </span>
      );
    } else if (stock > 0 && stock <= 3) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
          Stock faible
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
          Stock OK
        </span>
      );
    }
  };

  const showStockHistory = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProductHistory(product.stockHistory || []);
    setShowStockHistoryModal(true);
  };

  const resetProductForm = () => {
    setProductForm({
      nameFr: '',
      nameAr: '',
      descriptionFr: '',
      descriptionAr: '',
      price: 0,
      stock: 0,
      category: 'controllers',
      images: [''],
    });
    setImagePreview('');
    setSelectedProduct(null);
  };

  const openEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      nameFr: product.nameFr,
      nameAr: product.nameAr,
      descriptionFr: product.descriptionFr,
      descriptionAr: product.descriptionAr,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: product.images || [''],
    });
    setImagePreview(product.images && product.images[0] ? product.images[0] : '');
    setShowProductModal(true);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = language === 'ar' ? product.nameAr : product.nameFr;
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesFilter = true;
      if (stockFilter === 'out') {
        matchesFilter = product.stock === 0;
      } else if (stockFilter === 'low') {
        matchesFilter = product.stock > 0 && product.stock <= 3;
      } else if (stockFilter === 'ok') {
        matchesFilter = product.stock > 3;
      }

      return matchesSearch && matchesFilter;
    });
  }, [products, searchQuery, stockFilter, language]);

  const categories = [
    { value: 'controllers', label: t('controllers') },
    { value: 'headsets', label: t('headsets') },
    { value: 'cables', label: t('cables') },
    { value: 'wifi', label: t('wifi') },
    { value: 'accessories', label: t('accessories') },
    { value: 'consoles', label: t('consoles') },
    { value: 'giftCards', label: t('giftCards') },
  ];

  if (loading) {
    return <div className="text-center py-8 text-gaming-green">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{t('adminPanel')}</h1>
      </div>

      <div className="flex gap-4 border-b border-gaming-gray-light overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'text-gaming-green border-b-2 border-gaming-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5 inline-block mr-2" />
          {t('manageUsers')}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'products'
              ? 'text-gaming-green border-b-2 border-gaming-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-5 h-5 inline-block mr-2" />
          {t('manageProducts')}
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'stock'
              ? 'text-gaming-green border-b-2 border-gaming-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-5 h-5 inline-block mr-2" />
          Gestion du stock
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowUserModal(true)}>{t('createAccount')}</Button>
          </div>

          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.uid}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-white font-semibold">{user.email}</div>
                    {user.displayName && (
                      <div className="text-sm text-gray-300 mt-1">{user.displayName}</div>
                    )}
                    <div className="text-sm text-gray-400 mt-1">
                      {t(user.role)} • {t(user.status)}
                    </div>
                    <div className="text-gaming-cyan font-bold mt-1">
                      {user.credit} {t('credits')}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="min-w-[140px]">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.uid, e.target.value as UserRole)}
                        className="w-full px-3 py-2 bg-gaming-dark border border-gaming-gray-light rounded-lg text-white text-sm focus:outline-none focus:border-gaming-green transition-colors"
                      >
                        <option value="user">{t('user')}</option>
                        <option value="seller">{t('seller')}</option>
                        <option value="admin">{t('admin')}</option>
                      </select>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowCreditModal(true);
                      }}
                    >
                      {t('adjustCredit')}
                    </Button>
                    {user.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleUpdateUserStatus(user.uid, 'active')}
                      >
                        {t('activate')}
                      </Button>
                    )}
                    {user.status === 'active' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleUpdateUserStatus(user.uid, 'suspended')}
                      >
                        {t('suspend')}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                resetProductForm();
                setShowProductModal(true);
              }}
            >
              {t('addProduct')}
            </Button>
          </div>

          <div className="grid gap-4">
            {products.map((product) => {
              const name = language === 'ar' ? product.nameAr : product.nameFr;
              return (
                <Card key={product.id}>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-24 h-24 bg-gaming-dark rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-full h-full p-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{name}</h3>
                      <div className="text-sm text-gray-400 mt-1">
                        {t(product.category)} • {product.stock} {t('inStock')}
                      </div>
                      <div className="text-gaming-green font-bold mt-2">
                        {product.price.toLocaleString()} {t('da')}
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button size="sm" variant="secondary" onClick={() => openEditProduct(product)}>
                        {t('editProduct')}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        {t('deleteProduct')}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="space-y-4">
          <div className="bg-gaming-dark/50 border border-gaming-gray-light rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-2">Gestion du stock</h2>
            <p className="text-gray-400 text-sm">
              Modifiez les quantités en stock et sauvegardez les changements pour chaque produit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gaming-dark border border-gaming-gray-light rounded-lg text-white focus:outline-none focus:border-gaming-green transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStockFilter('all')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  stockFilter === 'all'
                    ? 'bg-gaming-green text-black'
                    : 'bg-gaming-dark border border-gaming-gray-light text-gray-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStockFilter('ok')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  stockFilter === 'ok'
                    ? 'bg-green-500 text-white'
                    : 'bg-gaming-dark border border-gaming-gray-light text-gray-400 hover:text-white'
                }`}
              >
                Stock OK
              </button>
              <button
                onClick={() => setStockFilter('low')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  stockFilter === 'low'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gaming-dark border border-gaming-gray-light text-gray-400 hover:text-white'
                }`}
              >
                Stock faible
              </button>
              <button
                onClick={() => setStockFilter('out')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  stockFilter === 'out'
                    ? 'bg-red-500 text-white'
                    : 'bg-gaming-dark border border-gaming-gray-light text-gray-400 hover:text-white'
                }`}
              >
                Rupture
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredProducts.map((product) => {
              const name = language === 'ar' ? product.nameAr : product.nameFr;
              const currentStock = stockUpdates[product.id] ?? product.stock;
              const hasChanged = currentStock !== product.stock;
              const stockStatus = getStockStatus(product.stock);
              const orderCount = orderCounts[product.id] || 0;

              return (
                <Card
                  key={product.id}
                  className={`transition-all duration-300 ${
                    stockStatus === 'out'
                      ? 'bg-red-500/5 border-red-500/30'
                      : stockStatus === 'low'
                      ? 'bg-orange-500/5 border-orange-500/30'
                      : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-24 h-24 bg-gaming-dark rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-full h-full p-4 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{name}</h3>
                        {language === 'ar' && product.nameFr && (
                          <p className="text-sm text-gray-400">{product.nameFr}</p>
                        )}
                        {language === 'fr' && product.nameAr && (
                          <p className="text-sm text-gray-400">{product.nameAr}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-gaming-green font-bold text-lg">
                          {product.price.toLocaleString()} {t('da')}
                        </div>
                        <div className="text-gray-400 text-sm">{t(product.category)}</div>
                        {getStockBadge(product.stock)}
                        <div className="text-sm text-gray-400">
                          Commandes: <span className="font-semibold text-gaming-cyan">{orderCount}</span>
                        </div>
                      </div>

                      {stockStatus === 'low' && (
                        <div className="flex items-center gap-2 text-orange-400 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Ce produit est presque épuisé</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-300 font-medium whitespace-nowrap">
                            Quantité en stock:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={currentStock}
                            onChange={(e) =>
                              handleStockChange(product.id, parseInt(e.target.value) || 0)
                            }
                            className="w-24 px-3 py-2 bg-gaming-dark border border-gaming-gray-light rounded-lg text-white text-center focus:outline-none focus:border-gaming-green transition-colors"
                          />
                        </div>

                        <Button
                          size="sm"
                          variant={hasChanged ? 'primary' : 'secondary'}
                          onClick={() => handleSaveStock(product.id)}
                          disabled={!hasChanged || savingStock[product.id] || stockStatus === 'out'}
                          className="flex items-center gap-2"
                        >
                          {savingStock[product.id] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sauvegarde...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Sauvegarder
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => showStockHistory(product)}
                          className="flex items-center gap-2"
                        >
                          <History className="w-4 h-4" />
                          Historique
                        </Button>

                        {hasChanged && (
                          <span className="text-xs text-gaming-cyan">Non sauvegardé</span>
                        )}

                        {stockStatus === 'out' && (
                          <span className="text-xs text-red-400">Stock épuisé - Ajoutez du stock pour sauvegarder</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setNewUserEmail('');
          setNewUserPassword('');
          setNewUserDisplayName('');
          setNewUserPhone('');
          setNewUserRole('user');
          setNewUserCredit(0);
        }}
        title={t('createAccount')}
      >
        <div className="space-y-4">
          <Input
            type="text"
            label={t('fullName') || 'Full Name'}
            value={newUserDisplayName}
            onChange={(e) => setNewUserDisplayName(e.target.value)}
            required
          />
          <Input
            type="tel"
            label={t('phone') || 'Phone Number'}
            value={newUserPhone}
            onChange={(e) => setNewUserPhone(e.target.value)}
            required
          />
          <Input
            type="email"
            label={t('email')}
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label={t('password')}
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            required
          />
          <Select
            label={t('role')}
            options={[
              { value: 'user', label: t('user') },
              { value: 'seller', label: t('seller') },
              { value: 'admin', label: t('admin') },
            ]}
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value as UserRole)}
          />
          <Input
            type="number"
            label={t('credits') || 'Crédits'}
            value={newUserCredit}
            onChange={(e) => setNewUserCredit(Number(e.target.value))}
            min="0"
          />
          <Button onClick={handleCreateUser} className="w-full">
            {t('createAccount')}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        title={t('adjustCredit')}
      >
        <div className="space-y-4">
          <div className="text-gray-300">
            {t('myCredit')}: {selectedUser?.credit || 0}
          </div>
          <Input
            type="number"
            label={t('amount')}
            value={creditAmount}
            onChange={(e) => setCreditAmount(Number(e.target.value))}
            placeholder="+100 or -50"
          />
          <Input
            type="text"
            label={t('reason')}
            value={creditReason}
            onChange={(e) => setCreditReason(e.target.value)}
          />
          <Button onClick={handleAdjustCredit} className="w-full">
            {t('save')}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          resetProductForm();
        }}
        title={selectedProduct ? t('editProduct') : t('addProduct')}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label={`${t('name')} (FR)`}
              value={productForm.nameFr}
              onChange={(e) => setProductForm({ ...productForm, nameFr: e.target.value })}
            />
            <Input
              label={`${t('name')} (AR)`}
              value={productForm.nameAr}
              onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label={`${t('description')} (FR)`}
              value={productForm.descriptionFr}
              onChange={(e) =>
                setProductForm({ ...productForm, descriptionFr: e.target.value })
              }
            />
            <Input
              label={`${t('description')} (AR)`}
              value={productForm.descriptionAr}
              onChange={(e) =>
                setProductForm({ ...productForm, descriptionAr: e.target.value })
              }
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              type="number"
              label={t('price')}
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
            />
            <Input
              type="number"
              label={t('stock')}
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
            />
            <Select
              label={t('category')}
              options={categories}
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('image')}</label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gaming-gray-light"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setProductForm({ ...productForm, images: [''] });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-gaming-green text-black rounded-lg hover:bg-gaming-green/90 transition-all font-semibold cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {imageUploading ? t('loading') : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                  />
                </label>
                {imageUploading && (
                  <span className="text-gaming-cyan text-sm">{t('loading')}</span>
                )}
              </div>
            </div>
          </div>
          <Button onClick={handleSaveProduct} className="w-full">
            {t('save')}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showStockHistoryModal}
        onClose={() => setShowStockHistoryModal(false)}
        title="Historique du stock"
        size="lg"
      >
        <div className="space-y-4">
          {selectedProductHistory.length > 0 ? (
            <div className="space-y-3">
              {selectedProductHistory
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((entry, index) => (
                  <div
                    key={index}
                    className="bg-gaming-dark/50 border border-gaming-gray-light rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm text-gray-400">
                          {new Date(entry.updatedAt).toLocaleString('fr-FR')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Par: {entry.updatedBy}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-semibold">{entry.previousStock}</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-green-400 font-semibold">{entry.newStock}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      Changement:{' '}
                      <span
                        className={
                          entry.newStock > entry.previousStock ? 'text-green-400' : 'text-red-400'
                        }
                      >
                        {entry.newStock > entry.previousStock ? '+' : ''}
                        {entry.newStock - entry.previousStock}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">Aucun historique disponible</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
