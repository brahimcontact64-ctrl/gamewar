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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Package, Upload, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { Product } from '../types';

export const SellerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const { categories: firebaseCategories } = useCategories(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    nameFr: '',
    nameAr: '',
    descriptionFr: '',
    descriptionAr: '',
    price: 0,
    stock: 0,
    category: 'controllers',
    categoryId: '',
    isActive: true,
    images: [''],
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

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
      const querySnapshot = await getDocs(q);
      setProducts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[]
      );
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
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
    } catch (error) {
      console.error('Error saving product:', error);
      alert(t('error'));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t('confirm'))) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      fetchProducts();
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
      categoryId: firebaseCategories.length > 0 ? firebaseCategories[0].id : '',
      isActive: true,
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
      categoryId: product.categoryId || '',
      isActive: product.isActive !== undefined ? product.isActive : true,
      images: product.images || [''],
    });
    setImagePreview(product.images && product.images[0] ? product.images[0] : '');
    setShowProductModal(true);
  };

  const categoryOptions = firebaseCategories.map((cat) => ({
    value: cat.id,
    label: language === 'ar' ? cat.nameAr : cat.nameFr,
  }));

  if (loading) {
    return <div className="text-center py-8 text-primary">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gaming-gray">{t('sellerPanel')}</h1>
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
              options={categoryOptions}
              value={productForm.categoryId}
              onChange={(e) => {
                const selectedCat = firebaseCategories.find(cat => cat.id === e.target.value);
                setProductForm({
                  ...productForm,
                  categoryId: e.target.value,
                  category: selectedCat?.key || 'controllers'
                });
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={productForm.isActive}
              onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-gaming-gray font-medium">
              Active (visible on website)
            </label>
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
