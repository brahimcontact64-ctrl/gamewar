import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
  };
}

const translations: Translations = {
  siteName: { fr: 'GameWar', ar: 'GameWar' },
  home: { fr: 'Accueil', ar: 'الرئيسية' },
  products: { fr: 'Produits', ar: 'المنتجات' },
  cart: { fr: 'Panier', ar: 'السلة' },
  orders: { fr: 'Commandes', ar: 'الطلبات' },
  dashboard: { fr: 'Tableau de bord', ar: 'لوحة التحكم' },
  login: { fr: 'Connexion', ar: 'تسجيل الدخول' },
  logout: { fr: 'Déconnexion', ar: 'تسجيل الخروج' },
  email: { fr: 'Email', ar: 'البريد الإلكتروني' },
  password: { fr: 'Mot de passe', ar: 'كلمة المرور' },
  signIn: { fr: 'Se connecter', ar: 'دخول' },
  createAccount: { fr: 'Créer un compte', ar: 'إنشاء حساب' },
  createAccountMessage: { fr: 'Créez un compte activé pour voir les prix', ar: 'أنشئ حسابًا مفعلًا لرؤية الأسعار' },
  accountActivationRequired: { fr: 'Votre compte doit être activé par un administrateur pour voir les prix', ar: 'يجب تفعيل حسابك من قبل المدير لرؤية الأسعار' },
  priceHidden: { fr: 'Prix masqué', ar: 'السعر مخفي' },
  price: { fr: 'Prix', ar: 'السعر' },
  addToCart: { fr: 'Ajouter au panier', ar: 'أضف إلى السلة' },
  outOfStock: { fr: 'Rupture de stock', ar: 'نفذت الكمية' },
  inStock: { fr: 'En stock', ar: 'متوفر' },
  category: { fr: 'Catégorie', ar: 'الفئة' },
  allCategories: { fr: 'Toutes les catégories', ar: 'كل الفئات' },
  controllers: { fr: 'Manettes', ar: 'يدات التحكم' },
  headsets: { fr: 'Casques Gaming', ar: 'سماعات الألعاب' },
  cables: { fr: 'Câbles', ar: 'الكابلات' },
  wifi: { fr: 'WiFi & Réseau', ar: 'واي فاي وشبكات' },
  accessories: { fr: 'Accessoires', ar: 'الإكسسوارات' },
  consoles: { fr: 'Consoles', ar: 'أجهزة الألعاب' },
  giftCards: { fr: 'Cartes cadeaux', ar: 'بطاقات الهدايا' },
  search: { fr: 'Rechercher...', ar: 'بحث...' },
  myCredit: { fr: 'Mon crédit', ar: 'رصيدي' },
  credits: { fr: 'crédits', ar: 'نقطة' },
  myOrders: { fr: 'Mes commandes', ar: 'طلباتي' },
  adminPanel: { fr: 'Panneau Admin', ar: 'لوحة المدير' },
  sellerPanel: { fr: 'Panneau Vendeur', ar: 'لوحة البائع' },
  manageUsers: { fr: 'Gérer les utilisateurs', ar: 'إدارة المستخدمين' },
  manageProducts: { fr: 'Gérer les produits', ar: 'إدارة المنتجات' },
  addProduct: { fr: 'Ajouter un produit', ar: 'إضافة منتج' },
  editProduct: { fr: 'Modifier le produit', ar: 'تعديل المنتج' },
  deleteProduct: { fr: 'Supprimer', ar: 'حذف' },
  save: { fr: 'Enregistrer', ar: 'حفظ' },
  cancel: { fr: 'Annuler', ar: 'إلغاء' },
  name: { fr: 'Nom', ar: 'الاسم' },
  description: { fr: 'Description', ar: 'الوصف' },
  stock: { fr: 'Stock', ar: 'المخزون' },
  image: { fr: 'Image URL', ar: 'رابط الصورة' },
  role: { fr: 'Rôle', ar: 'الدور' },
  status: { fr: 'Statut', ar: 'الحالة' },
  active: { fr: 'Actif', ar: 'نشط' },
  pending: { fr: 'En attente', ar: 'قيد الانتظار' },
  suspended: { fr: 'Suspendu', ar: 'معلق' },
  guest: { fr: 'Invité', ar: 'زائر' },
  user: { fr: 'Utilisateur', ar: 'مستخدم' },
  seller: { fr: 'Vendeur', ar: 'بائع' },
  admin: { fr: 'Admin', ar: 'مدير' },
  actions: { fr: 'Actions', ar: 'الإجراءات' },
  activate: { fr: 'Activer', ar: 'تفعيل' },
  suspend: { fr: 'Suspendre', ar: 'تعليق' },
  adjustCredit: { fr: 'Ajuster le crédit', ar: 'تعديل الرصيد' },
  total: { fr: 'Total', ar: 'المجموع' },
  checkout: { fr: 'Commander', ar: 'إتمام الطلب' },
  emptyCart: { fr: 'Votre panier est vide', ar: 'سلتك فارغة' },
  phone: { fr: 'Téléphone', ar: 'رقم الهاتف' },
  address: { fr: 'Adresse de livraison', ar: 'عنوان التوصيل' },
  notes: { fr: 'Notes', ar: 'ملاحظات' },
  placeOrder: { fr: 'Passer la commande', ar: 'تأكيد الطلب' },
  orderPlaced: { fr: 'Commande passée avec succès', ar: 'تم الطلب بنجاح' },
  contactUs: { fr: 'Contactez-nous', ar: 'اتصل بنا' },
  whatsapp: { fr: 'WhatsApp', ar: 'واتساب' },
  cashOnDelivery: { fr: 'Paiement à la livraison', ar: 'الدفع عند الاستلام' },
  da: { fr: 'DA', ar: 'دج' },
  quantity: { fr: 'Quantité', ar: 'الكمية' },
  remove: { fr: 'Retirer', ar: 'إزالة' },
  createdAt: { fr: 'Créé le', ar: 'تاريخ الإنشاء' },
  orderStatus: { fr: 'Statut', ar: 'الحالة' },
  confirmed: { fr: 'Confirmé', ar: 'مؤكد' },
  delivered: { fr: 'Livré', ar: 'تم التوصيل' },
  cancelled: { fr: 'Annulé', ar: 'ملغي' },
  creditHistory: { fr: 'Historique du crédit', ar: 'سجل الرصيد' },
  purchase: { fr: 'Achat', ar: 'شراء' },
  abandoned_cart: { fr: 'Panier abandonné', ar: 'سلة متروكة' },
  spam: { fr: 'Spam', ar: 'سبام' },
  admin_adjustment: { fr: 'Ajustement admin', ar: 'تعديل من المدير' },
  reason: { fr: 'Raison', ar: 'السبب' },
  amount: { fr: 'Montant', ar: 'المبلغ' },
  date: { fr: 'Date', ar: 'التاريخ' },
  noOrders: { fr: 'Aucune commande', ar: 'لا توجد طلبات' },
  noProducts: { fr: 'Aucun produit trouvé', ar: 'لم يتم العثور على منتجات' },
  loading: { fr: 'Chargement...', ar: 'جاري التحميل...' },
  error: { fr: 'Erreur', ar: 'خطأ' },
  success: { fr: 'Succès', ar: 'نجاح' },
  loginRequired: { fr: 'Connexion requise', ar: 'يجب تسجيل الدخول' },
  accountNotActivated: { fr: 'Compte non activé. Contactez l\'administrateur.', ar: 'الحساب غير مفعل. اتصل بالمدير.' },
  lowCredit: { fr: 'Crédit insuffisant', ar: 'الرصيد غير كافٍ' },
  viewDetails: { fr: 'Voir détails', ar: 'عرض التفاصيل' },
  close: { fr: 'Fermer', ar: 'إغلاق' },
  confirm: { fr: 'Confirmer', ar: 'تأكيد' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
