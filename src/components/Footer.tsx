import React from 'react';
import { Gamepad2, MessageCircle, MapPin, Phone, Mail, Facebook, Instagram, Music, Youtube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../hooks/useSettings';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-secondary">{settings.storeName}</span>
            </div>
            <p className="text-gray-600 text-sm">
              Votre destination gaming en Algérie. Accessoires gaming, consoles, et plus encore.
            </p>
          </div>

          <div>
            <h3 className="text-secondary font-bold mb-4">{t('contactUs')}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-secondary font-bold mb-4">Suivez-nous</h3>
            <div className="flex gap-3 flex-wrap">
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.socialLinks?.whatsapp && (
                <a
                  href={settings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings.socialLinks?.tiktok && (
                <a
                  href={settings.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                  aria-label="TikTok"
                >
                  <Music className="w-5 h-5" />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
            {!settings.socialLinks?.facebook &&
              !settings.socialLinks?.instagram &&
              !settings.socialLinks?.whatsapp &&
              !settings.socialLinks?.tiktok &&
              !settings.socialLinks?.youtube && (
                <p className="text-sm text-gray-500">Connectez-vous avec nous bientôt!</p>
              )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center text-gray-600 text-sm">
          © 2024 {settings.storeName}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};
