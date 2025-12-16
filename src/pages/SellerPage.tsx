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
  where,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase/config';
import { Package } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';

const storage = getStorage();

export const SellerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [productForm, setProductForm] = useState({
    nameFr: '',
    nameAr: '',
    descriptionFr: '',
    descriptionAr: '',
    price: 0,
    stock: 0,
    category: 'controllers',
    images: [] as string[],
  });

  useEffect(() => {
    fetchProducts();
  }, [userProfile]);

  const fetchProducts = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'products'),
        where('createdBy', '==', userProfile.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);

      setProducts(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[]
      );
    } finally {
      setLoading(false);
    }
  };

  // 📸 Upload image to Firebase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      setUploadingImage(true);
      const file = e.target.files[0];
      const imageRef = ref(
        storage,
        `products/${userProfile?.uid}/${Date.now()}_${file.name}`
      );

      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      setProductForm((prev) => ({
        ...prev,
        images: [url],
      }));
    } catch {
      alert(t('error'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!userProfile) return;

    try {
      if (selectedProduct) {
        await updateDoc(doc(db, 'products', selectedProduct.id), {
          ...productForm,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productForm,
          createdBy: userProfile.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      alert(t('success'));
      setShowProductModal(false);
      resetProductForm();
      fetchProducts();
    } catch {
      alert(t('error'));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t('confirm'))) return;
    await deleteDoc(doc(db, 'products', productId));
    fetchProducts();
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
      images: [],
    });
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
      images: product.images || [],
    });
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
    return <div className="text-center py-8 text-gaming-green">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{t('sellerPanel')}</h1>
        <Button
          onClick={() => {
            resetProductForm();
            setShowProductModal(true);
          }}
        >
          {t('addProduct')}
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-24 h-24 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => {
            const name = language === 'ar' ? product.nameAr : product.nameFr;
            return (
              <Card key={product.id}>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gaming-dark rounded-lg overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-full h-full p-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{name}</h3>
                    <div className="text-sm text-gray-400">
                      {t(product.category)} • {product.stock} {t('inStock')}
                    </div>
                    <div className="text-gaming-green font-bold">
                      {product.price.toLocaleString()} {t('da')}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => openEditProduct(product)}>
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
      )}

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
          <Input label="Nom (FR)" value={productForm.nameFr}
            onChange={(e) => setProductForm({ ...productForm, nameFr: e.target.value })} />

          <Input label="Nom (AR)" value={productForm.nameAr}
            onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })} />

          <Input label="Description (FR)" value={productForm.descriptionFr}
            onChange={(e) => setProductForm({ ...productForm, descriptionFr: e.target.value })} />

          <Input label="Description (AR)" value={productForm.descriptionAr}
            onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })} />

          <Input type="number" label={t('price')}
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} />

          <Input type="number" label={t('stock')}
            value={productForm.stock}
            onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} />

          <Select label={t('category')} options={categories}
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />

          {/* 📸 Upload image */}
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {uploadingImage && (
            <p className="text-sm text-gaming-cyan">{t('loading')}</p>
          )}

          {productForm.images[0] && (
            <img src={productForm.images[0]} className="w-32 rounded" />
          )}

          <Button onClick={handleSaveProduct} className="w-full">
            {t('save')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};