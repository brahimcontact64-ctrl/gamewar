import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';
import { Users, Package, TrendingUp, TrendingDown, Upload, X, Settings, Grid3x3 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Product, UserRole, UserStatus } from '../types';

import { AdminSettingsPage } from './AdminSettingsPage';
import { AdminCategoriesPage } from './AdminCategoriesPage';

export const AdminPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'settings' | 'categories'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');

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

  useEffect(() => {
    fetchData();
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

      setProducts(
        productsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[]
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUserEmail,
        newUserPassword
      );

      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: newUserEmail,
        role: newUserRole,
        status: 'active',
        credit: 100,
        createdAt: serverTimestamp(),
      });

      alert(t('success'));
      setShowUserModal(false);
      setNewUserEmail('');
      setNewUserPassword('');
      fetchData();
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(error.message);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), { status });
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
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

      alert(t('success'));
      setShowCreditModal(false);
      setCreditAmount(0);
      setCreditReason('');
      fetchData();
    } catch (error) {
      console.error('Error adjusting credit:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);

      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setProductForm({ ...productForm, images: [downloadURL] });
      setImagePreview(downloadURL);
      setImageUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
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
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      alert(t('success'));
      setShowProductModal(false);
      resetProductForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t('confirm'))) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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
    return <div className="text-center py-8 text-primary">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gaming-gray">{t('adminPanel')}</h1>
      </div>

      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gaming-gray'
          }`}
        >
          <Users className="w-5 h-5 inline-block mr-2" />
          {t('manageUsers')}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'products'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gaming-gray'
          }`}
        >
          <Package className="w-5 h-5 inline-block mr-2" />
          {t('manageProducts')}
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'categories'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gaming-gray'
          }`}
        >
          <Grid3x3 className="w-5 h-5 inline-block mr-2" />
          Categories
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gaming-gray'
          }`}
        >
          <Settings className="w-5 h-5 inline-block mr-2" />
          Settings
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
                  <div>
                    <div className="text-gaming-gray font-semibold">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      {t(user.role)} • {t(user.status)}
                    </div>
                    <div className="text-primary font-bold mt-1">
                      {user.credit} {t('credits')}
                    </div>
                  </div>
                  <div className="flex gap-2">
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

      {activeTab === 'categories' && <AdminCategoriesPage />}

      {activeTab === 'settings' && <AdminSettingsPage />}

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
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-full h-full p-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gaming-gray">{name}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {t(product.category)} • {product.stock} {t('inStock')}
                      </div>
                      <div className="text-primary font-bold mt-2">
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

      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title={t('createAccount')}>
        <div className="space-y-4">
          <Input
            type="email"
            label={t('email')}
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <Input
            type="password"
            label={t('password')}
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
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
              onChange={(e) => setProductForm({ ...productForm, descriptionFr: e.target.value })}
            />
            <Input
              label={`${t('description')} (AR)`}
              value={productForm.descriptionAr}
              onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('image')}
            </label>
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
                <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold cursor-pointer shadow-sm">
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
                  <span className="text-primary text-sm">{t('loading')}</span>
                )}
              </div>
            </div>
          </div>
          <Button onClick={handleSaveProduct} className="w-full">
            {t('save')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
