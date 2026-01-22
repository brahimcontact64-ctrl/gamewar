import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product } from '../types';

export const useProducts = (categoryId?: string, activeOnly: boolean = true) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let q;
      const constraints = [];

      if (activeOnly) {
        constraints.push(where('isActive', '==', true));
      }

      if (categoryId) {
        constraints.push(where('categoryId', '==', categoryId));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      q = query(collection(db, 'products'), ...constraints);

      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Product[];

      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, activeOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

export const useProductsByCategory = (activeOnly: boolean = true) => {
  const [productsByCategory, setProductsByCategory] = useState<Map<string, Product[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsByCategory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const constraints = [];

      if (activeOnly) {
        constraints.push(where('isActive', '==', true));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(collection(db, 'products'), ...constraints);
      const querySnapshot = await getDocs(q);

      const categoryMap = new Map<string, Product[]>();

      querySnapshot.docs.forEach((doc) => {
        const product = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Product;

        const categoryId = product.categoryId;
        if (categoryId) {
          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, []);
          }
          categoryMap.get(categoryId)!.push(product);
        }
      });

      setProductsByCategory(categoryMap);
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError('Failed to load products');
      setProductsByCategory(new Map());
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  return { productsByCategory, loading, error, refetch: fetchProductsByCategory };
};
