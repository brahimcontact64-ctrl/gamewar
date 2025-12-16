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

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const displayName =
    userProfile?.displayName ||
    userProfile?.email ||
    userProfile?.phone ||
    '';

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="bg-gaming-gray border-b border-gaming-gray-light sticky top-0 z-40 backdrop-blur-sm bg-gaming-gray/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <button
              onClick={() => handleNavigate('/')}
              className="text-2xl font-bold text-gaming-green"
            >
              {t('siteName')}
            </button>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => navigate('/')} className="nav-btn">
                {t('home')}
              </button>

              <button onClick={() => navigate('/products')} className="nav-btn">
                {t('products')}
              </button>

              <button
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="nav-btn"
              >
                <Globe className="w-4 h-4" /> {language === 'fr' ? 'AR' : 'FR'}
              </button>

              {!isGuest && (
                <>
                  <button onClick={() => navigate('/orders')} className="nav-btn">
                    <Package className="w-4 h-4" /> {t('myOrders')}
                  </button>

                  <button onClick={() => navigate('/cart')} className="relative nav-btn">
                    <ShoppingCart className="w-4 h-4" />
                    {cartItemCount > 0 && (
                      <span className="badge">{cartItemCount}</span>
                    )}
                  </button>

                  {isAdmin && (
                    <button onClick={() => navigate('/admin')} className="nav-btn">
                      <Shield className="w-4 h-4" /> Admin
                    </button>
                  )}

                  {isSeller && (
                    <button onClick={() => navigate('/seller')} className="nav-btn">
                      <Store className="w-4 h-4" /> Seller
                    </button>
                  )}

                  <button onClick={handleSignOut} className="nav-btn text-red-400">
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}

              {isGuest && (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gaming-green text-black px-4 py-2 rounded-lg font-semibold"
                >
                  {t('login')}
                </button>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gaming-green"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 md:hidden">
          <div className="absolute top-0 right-0 w-4/5 max-w-sm h-full bg-gaming-dark p-6 flex flex-col gap-6">

            {/* CLOSE */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="self-end text-gaming-green"
            >
              <X className="w-7 h-7" />
            </button>

            {/* LINKS */}
            <button
              onClick={() => handleNavigate('/')}
              className="w-full text-left text-lg text-gray-200 py-3 px-4 rounded-lg hover:bg-gaming-gray transition"
            >
              {t('home')}
            </button>

            <button
              onClick={() => handleNavigate('/products')}
              className="w-full text-left text-lg text-gray-200 py-3 px-4 rounded-lg hover:bg-gaming-gray transition"
            >
              {t('products')}
            </button>

            {!isGuest && (
              <>
                <button
                  onClick={() => handleNavigate('/orders')}
                  className="w-full text-left text-lg text-gray-200 py-3 px-4 rounded-lg hover:bg-gaming-gray transition"
                >
                  {t('myOrders')}
                </button>

                <button
                  onClick={() => handleNavigate('/cart')}
                  className="w-full text-left text-lg text-gray-200 py-3 px-4 rounded-lg hover:bg-gaming-gray transition"
                >
                  {t('cart')}
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNavigate('/admin')}
                    className="w-full text-left text-lg text-gray-200 py-3 px-4 rounded-lg hover:bg-gaming-gray transition"
                  >
                    Admin
                  </button>
                )}

                {isSeller && (
                  <button
                    onClick={() => handleNavigate('/seller')}
                    className="w-full text-left text-lg text-gray-200 py-3 px-4 rounded-lg hover:bg-gaming-gray transition"
                  >
                    Seller
                  </button>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-lg text-red-400 py-3 px-4 rounded-lg hover:bg-gaming-gray transition"
                >
                  {t('logout')}
                </button>
              </>
            )}

            {isGuest && (
              <button
                onClick={() => handleNavigate('/login')}
                className="bg-gaming-green text-black py-3 rounded-lg font-bold text-lg"
              >
                {t('login')}
              </button>
            )}

            {/* LANGUAGE */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="w-full text-left text-lg text-gray-200 py-3 px-4 rounded-lg hover:bg-gaming-gray transition"
            >
              🌍 {language === 'fr' ? 'العربية' : 'Français'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};