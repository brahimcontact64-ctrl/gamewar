import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Category } from '../types';

export const useCategories = (activeOnly: boolean = true) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let q;
      if (activeOnly) {
        q = query(
          collection(db, 'categories'),
          where('isActive', '==', true),
          orderBy('order', 'asc')
        );
      } else {
        q = query(collection(db, 'categories'), orderBy('order', 'asc'));
      }

      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Category[];

      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};
