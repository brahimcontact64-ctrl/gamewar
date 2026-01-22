import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Settings } from '../types';

const defaultSettings: Settings = {
  storeName: 'GAMEWAR',
  phone: '+213 123 456 789',
  email: 'contact@gamezonedz.com',
  whatsapp: '213123456789',
  address: 'Algérie',
  workingHours: '9h - 18h',
  updatedAt: new Date(),
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'settings', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Settings);
      } else {
        await setDoc(docRef, {
          ...defaultSettings,
          updatedAt: serverTimestamp(),
        });
        setSettings(defaultSettings);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const docRef = doc(db, 'settings', 'main');
      await setDoc(docRef, {
        ...settings,
        ...newSettings,
        updatedAt: serverTimestamp(),
      });
      await fetchSettings();
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, error, updateSettings, refetch: fetchSettings };
};
