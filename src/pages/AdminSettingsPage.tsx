import React, { useState, useEffect } from 'react';
import { Settings, Save, Facebook, Instagram, Send, Music, Youtube } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../hooks/useSettings';

export const AdminSettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { settings, loading, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    storeName: '',
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    workingHours: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      whatsapp: '',
      tiktok: '',
      youtube: '',
    },
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName,
        phone: settings.phone,
        email: settings.email,
        whatsapp: settings.whatsapp,
        address: settings.address,
        workingHours: settings.workingHours || '',
        socialLinks: settings.socialLinks || {
          facebook: '',
          instagram: '',
          whatsapp: '',
          tiktok: '',
          youtube: '',
        },
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const result = await updateSettings(formData);
    setSaving(false);
    if (result) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-primary">{t('loading')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gaming-gray">Store Settings</h1>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gaming-gray mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Store Name"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+213 123 456 789"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@example.com"
                required
              />
              <Input
                label="WhatsApp Number"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="213123456789"
                required
              />
              <Input
                label="Physical Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <Input
                label="Working Hours (Optional)"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                placeholder="9h - 18h"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gaming-gray">Social Media Links</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium text-gaming-gray">Facebook URL</label>
                </div>
                <Input
                  value={formData.socialLinks.facebook}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <label className="text-sm font-medium text-gaming-gray">Instagram URL</label>
                </div>
                <Input
                  value={formData.socialLinks.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-4 h-4 text-green-600" />
                  <label className="text-sm font-medium text-gaming-gray">WhatsApp Link</label>
                </div>
                <Input
                  value={formData.socialLinks.whatsapp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, whatsapp: e.target.value },
                    })
                  }
                  placeholder="https://wa.me/213123456789"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Music className="w-4 h-4 text-gray-900" />
                  <label className="text-sm font-medium text-gaming-gray">TikTok URL</label>
                </div>
                <Input
                  value={formData.socialLinks.tiktok}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, tiktok: e.target.value },
                    })
                  }
                  placeholder="https://tiktok.com/@yourpage"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Youtube className="w-4 h-4 text-red-600" />
                  <label className="text-sm font-medium text-gaming-gray">YouTube URL</label>
                </div>
                <Input
                  value={formData.socialLinks.youtube}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                    })
                  }
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Leave fields empty to hide icons from the website. Only filled links will be displayed.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            {success && (
              <span className="text-primary font-semibold">Settings saved successfully!</span>
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="font-bold text-gaming-gray mb-2">Important Notes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Contact information is displayed in the footer and throughout the site</li>
              <li>• WhatsApp number should be in international format without + or spaces</li>
              <li>• Social media icons appear only when links are provided</li>
              <li>• Changes take effect immediately after saving</li>
              <li>• All contact fields except working hours are required</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
