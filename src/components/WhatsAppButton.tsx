import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const WhatsAppButton: React.FC = () => {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/213775294279', '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 flex items-center gap-2 group"
      aria-label={t('whatsapp')}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        {t('contactUs')}
      </span>
    </button>
  );
};
