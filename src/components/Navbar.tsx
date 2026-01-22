import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, Globe, Menu, X, Shield, Store, Package } from 'lucide-react';
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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-primary-dark hover:to-secondary-dark transition-colors"
            >
              {t('siteName')}
            </button>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="text-gaming-gray hover:text-primary transition-colors"
              >
                {t('home')}
              </button>
              <button
                onClick={() => navigate('/products')}
                className="text-gaming-gray hover:text-primary transition-colors"
              >
                {t('products')}
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gaming-gray hover:text-primary hover:bg-gray-100 transition-all"
            >
              <Globe className="w-5 h-5" />
              <span>{language === 'fr' ? 'AR' : 'FR'}</span>
            </button>

            {!isGuest && userProfile && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                  <span className="text-primary font-bold">{userProfile.credit}</span>
                  <span className="text-gray-500 text-sm">{t('credits')}</span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gaming-gray hover:text-primary hover:bg-gray-100 transition-all"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="hidden lg:inline">{t('adminPanel')}</span>
                  </button>
                )}

                {isSeller && (
                  <button
                    onClick={() => navigate('/seller')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gaming-gray hover:text-primary hover:bg-gray-100 transition-all"
                  >
                    <Store className="w-5 h-5" />
                    <span className="hidden lg:inline">{t('sellerPanel')}</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/orders')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gaming-gray hover:text-primary hover:bg-gray-100 transition-all"
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden lg:inline">{t('myOrders')}</span>
                </button>

                <button
                  onClick={() => navigate('/cart')}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-gaming-gray hover:text-primary hover:bg-gray-100 transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gaming-gray hover:text-accent hover:bg-gray-100 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}

            {isGuest && (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold"
              >
                <User className="w-5 h-5" />
                {t('login')}
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gaming-gray hover:text-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gaming-gray hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
              >
                {t('home')}
              </button>
              <button
                onClick={() => {
                  navigate('/products');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-gaming-gray hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
              >
                {t('products')}
              </button>

              {!isGuest && (
                <>
                  <button
                    onClick={() => {
                      navigate('/orders');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-2 text-gaming-gray hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {t('myOrders')}
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gaming-gray hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                    >
                      {t('adminPanel')}
                    </button>
                  )}

                  {isSeller && (
                    <button
                      onClick={() => {
                        navigate('/seller');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gaming-gray hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                    >
                      {t('sellerPanel')}
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="text-left px-4 py-2 text-gaming-gray hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
              >
                {language === 'fr' ? 'العربية' : 'Français'}
              </button>

              {isGuest && (
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold"
                >
                  {t('login')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
