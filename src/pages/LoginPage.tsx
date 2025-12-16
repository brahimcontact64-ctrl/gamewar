import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gaming-green/10 rounded-full mb-4">
            <Gamepad2 className="w-8 h-8 text-gaming-green" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('siteName')}</h1>
          <p className="text-gray-400">{t('login')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <Input
            type="email"
            label={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="exemple@email.com"
          />

          <Input
            type="password"
            label={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? t('loading') : t('signIn')}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gaming-dark rounded-lg">
          <p className="text-sm text-gray-400 text-center">
            {t('accountNotActivated')}
          </p>
        </div>
      </Card>
    </div>
  );
};
