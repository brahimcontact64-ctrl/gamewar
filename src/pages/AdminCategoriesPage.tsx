import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Grid3x3, Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../contexts/LanguageContext';
import { Category } from '../types';

export const AdminCategoriesPage: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nameFr: '',
    nameAr: '',
    key: '',
    icon: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!formData.nameFr || !formData.nameAr || !formData.key) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'categories'), {
          ...formData,
          order: categories.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await updateDoc(doc(db, 'categories', category.id), {
        isActive: !category.isActive,
        updatedAt: serverTimestamp(),
      });
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category:', error);
      alert('Failed to update category');
    }
  };

  const handleReorder = async (category: Category, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex((c) => c.id === category.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === categories.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapCategory = categories[newIndex];

    try {
      await Promise.all([
        updateDoc(doc(db, 'categories', category.id), {
          order: swapCategory.order,
          updatedAt: serverTimestamp(),
        }),
        updateDoc(doc(db, 'categories', swapCategory.id), {
          order: category.order,
          updatedAt: serverTimestamp(),
        }),
      ]);
      fetchCategories();
    } catch (error) {
      console.error('Error reordering categories:', error);
      alert('Failed to reorder categories');
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nameFr: category.nameFr,
      nameAr: category.nameAr,
      key: category.key,
      icon: category.icon,
      order: category.order,
      isActive: category.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nameFr: '',
      nameAr: '',
      key: '',
      icon: '',
      order: 0,
      isActive: true,
    });
    setEditingCategory(null);
  };

  if (loading) {
    return <div className="text-center py-8 text-primary">{t('loading')}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Grid3x3 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gaming-gray">Categories Management</h1>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((category, index) => (
          <Card key={category.id}>
            <div className="flex items-center gap-4">
              <div className="text-2xl">{category.icon || '📦'}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gaming-gray">{category.nameFr}</h3>
                  <span className="text-gray-500">({category.nameAr})</span>
                  <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {category.key}
                  </span>
                  {!category.isActive && (
                    <span className="text-sm text-accent bg-accent/10 px-2 py-1 rounded font-semibold">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">Order: {category.order}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleReorder(category, 'up')}
                  disabled={index === 0}
                >
                  <MoveUp className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleReorder(category, 'down')}
                  disabled={index === categories.length - 1}
                >
                  <MoveDown className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggleActive(category)}
                  className={category.isActive ? 'text-primary' : 'text-gray-400'}
                >
                  {category.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => openEditModal(category)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteCategory(category.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              No categories yet. Create your first category to get started.
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Name (French) *"
              value={formData.nameFr}
              onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
              required
            />
            <Input
              label="Name (Arabic) *"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              required
            />
          </div>
          <Input
            label="Key (URL/Code) *"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="e.g., controllers, headsets"
            required
          />
          <Input
            label="Icon (Emoji or Text)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="🎮"
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-gaming-gray font-medium">
              Active (visible on frontend)
            </label>
          </div>
          <Button onClick={handleSaveCategory} className="w-full">
            {editingCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </Modal>

      <Card className="bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Grid3x3 className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="font-bold text-gaming-gray mb-2">Category Management Guide</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Categories determine product organization throughout the site</li>
              <li>• Use the key field to match products (e.g., "controllers" or "headsets")</li>
              <li>• Reorder categories using the up/down arrows to control display order</li>
              <li>• Toggle visibility with the eye icon - inactive categories won't show on frontend</li>
              <li>• Deleting a category does not delete products, but they may become uncategorized</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
