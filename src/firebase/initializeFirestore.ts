import { collection, getDocs, doc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

const defaultCategories = [
  {
    nameFr: 'Manettes',
    nameAr: 'أذرع التحكم',
    icon: 'Gamepad2',
    key: 'controllers',
    order: 0,
    isActive: true,
  },
  {
    nameFr: 'Casques Gaming',
    nameAr: 'سماعات الألعاب',
    icon: 'Headphones',
    key: 'headsets',
    order: 1,
    isActive: true,
  },
  {
    nameFr: 'Câbles',
    nameAr: 'كابلات',
    icon: 'Cable',
    key: 'cables',
    order: 2,
    isActive: true,
  },
  {
    nameFr: 'Wifi & Réseau',
    nameAr: 'واي فاي والشبكة',
    icon: 'Wifi',
    key: 'wifi',
    order: 3,
    isActive: true,
  },
  {
    nameFr: 'Consoles',
    nameAr: 'أجهزة الألعاب',
    icon: 'MonitorPlay',
    key: 'consoles',
    order: 4,
    isActive: true,
  },
  {
    nameFr: 'Cartes Cadeaux',
    nameAr: 'بطاقات الهدايا',
    icon: 'Gift',
    key: 'giftCards',
    order: 5,
    isActive: true,
  },
  {
    nameFr: 'Accessoires',
    nameAr: 'إكسسوارات',
    icon: 'Package',
    key: 'accessories',
    order: 6,
    isActive: true,
  },
];

const defaultSettings = {
  storeName: 'GAMEWAR',
  phone: '+213 123 456 789',
  email: 'contact@gamezonedz.com',
  whatsapp: '213123456789',
  address: 'Algérie',
  workingHours: '9h - 18h',
  socialLinks: {
    facebook: '',
    instagram: '',
    whatsapp: '',
    tiktok: '',
    youtube: '',
  },
};

let isInitialized = false;

export const initializeFirestore = async (): Promise<void> => {
  if (isInitialized) {
    console.log('Firestore already initialized, skipping...');
    return;
  }

  console.log('🔥 Starting Firestore initialization...');
  try {
    await Promise.all([
      initializeCategories(),
      initializeSettings(),
    ]);

    isInitialized = true;
    console.log('✅ Firestore initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    console.error('⚠️  Make sure Firestore rules are properly configured');
    console.error('⚠️  Check Firebase Console for more details');
  }
};

const initializeCategories = async (): Promise<void> => {
  try {
    console.log('Checking categories collection...');
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);

    if (snapshot.empty) {
      console.log('Categories collection is empty. Seeding default categories...');

      const promises = defaultCategories.map((category) =>
        addDoc(categoriesRef, {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );

      await Promise.all(promises);
      console.log(`✅ Successfully seeded ${defaultCategories.length} default categories`);
    } else {
      console.log(`✅ Found ${snapshot.size} existing categories`);
    }
  } catch (error) {
    console.error('❌ Error initializing categories:', error);
    console.error('This may be due to Firestore rules. Please ensure categories collection has proper read/write permissions.');
    throw error;
  }
};

const initializeSettings = async (): Promise<void> => {
  try {
    console.log('Checking settings document...');
    const settingsRef = doc(db, 'settings', 'main');
    const snapshot = await getDoc(settingsRef);

    if (!snapshot.exists()) {
      console.log('Settings document does not exist. Creating default settings...');

      await setDoc(settingsRef, {
        ...defaultSettings,
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Successfully created default settings');
    } else {
      console.log('✅ Settings document already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing settings:', error);
    console.error('This may be due to Firestore rules. Please ensure settings collection has proper read/write permissions.');
    throw error;
  }
};
