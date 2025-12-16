import React from 'react';
import { Gamepad2, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gaming-gray border-t border-gaming-gray-light mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* TOP */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6 text-gaming-green" />
              <span className="text-xl font-bold text-gaming-green">
                {t('siteName')}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Votre destination gaming en Algérie. Accessoires gaming, consoles,
              et plus encore.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('contactUs')}
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+213775 29 42 79</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@GameWar.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Algérie</span>
              </div>
            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('followUs') ?? 'Suivez-nous'}
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  window.open('https://wa.me/213775294279', '_blank')
                }
                className="w-10 h-10 bg-gaming-dark rounded-lg flex items-center justify-center text-gaming-green hover:bg-gaming-green hover:text-black transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gaming-gray-light pt-6 text-center space-y-2">
          <div className="text-gray-500 text-sm">
            ©️ 2024 {t('siteName')}. Tous droits réservés.
          </div>

          {/* SIGNATURE */}
          <div className="text-gray-600 text-xs">
            Développé par{' '}
            <a
              href="https://wa.me/message/XHGY46CKSPJAN1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gaming-green font-semibold hover:underline"
            >
              Brahim Dev
            </a>{' '}
            💻
          </div>
        </div>
      </div>
    </footer>
  );
};