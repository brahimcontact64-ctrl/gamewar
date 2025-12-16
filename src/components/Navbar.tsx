import React, { useState } from 'react';
import {
  ShoppingCart,
  User,
  LogOut,
  Globe,
  Menu,
  X,
  Shield,
  Store,
  Package
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  cartItemCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartItemCount }) => {
  const { t, language, setLanguage } = useLanguage();
  const { userProfile, signOut, isGuest, isAdmin, isSeller } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  
  const displayName =
    userProfile?.displayName ||
    userProfile?.email ||
    userProfile?.phone ||
    '';

  return (
    <nav className="bg-gaming-gray border-b border-gaming-gray-light sticky top-0 z-40 backdrop-blur-sm bg-gaming-gray/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-gaming-green hover:text-gaming-cyan transition-colors"
            >
              {t('siteName')}
            </button>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-gaming-green transition-colors"
              >
                {t('home')}
              </button>
              <button
                onClick={() => navigate('/products')}
                className="text-gray-300 hover:text-gaming-green transition-colors"
              >
                {t('products')}
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* 🌍 Language */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-gaming-green hover:bg-gaming-dark transition-all"
            >
              <Globe className="w-5 h-5" />
              <span>{language === 'fr' ? 'AR' : 'FR'}</span>
            </button>

            {!isGuest && userProfile && (
              <>
                {/* 👤 USER NAME / EMAIL / PHONE */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gaming-dark rounded-lg">
                  <User className="w-4 h-4 text-gaming-cyan" />
                  <span className="text-sm text-gray-200 max-w-[140px] truncate">
                    {displayName}
                  </span>
                </div>

                {/* 💳 CREDITS */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gaming-dark rounded-lg">
                  <span className="text-gaming-cyan font-bold">
                    {userProfile.credit}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {t('credits')}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-gaming-cyan hover:bg-gaming-dark transition-all"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="hidden lg:inline">
                      {t('adminPanel')}
                    </span>
                  </button>
                )}

                {isSeller && (
                  <button
                    onClick={() => navigate('/seller')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-gaming-cyan hover:bg-gaming-dark transition-all"
                  >
                    <Store className="w-5 h-5" />
                    <span className="hidden lg:inline">
                      {t('sellerPanel')}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/orders')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-gaming-green hover:bg-gaming-dark transition-all"
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden lg:inline">
                    {t('myOrders')}
                  </span>
                </button>

                <button
                  onClick={() => navigate('/cart')}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-gaming-green hover:bg-gaming-dark transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gaming-green text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-gaming-dark transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}

            {isGuest && (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 bg-gaming-green text-black rounded-lg hover:bg-gaming-green/90 transition-all font-semibold"
              >
                <User className="w-5 h-5" />
                {t('login')}
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-gaming-green"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
};