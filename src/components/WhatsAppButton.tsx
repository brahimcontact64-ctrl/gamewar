import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../hooks/useSettings';

export const WhatsAppButton: React.FC = () => {
  const { t } = useLanguage();
  const { settings } = useSettings();

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${settings.whatsapp}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg shadow-primary/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-primary/40 flex items-center gap-2 group"
      aria-label={t('whatsapp')}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        {t('contactUs')}
      </span>
    </button>
  );
};
