import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err?.message || 'Грешка при влизане. Моля проверете имейл и парола.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gallery-canvas flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-background rounded-xl shadow-soft border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-sophisticated-dark mb-2">
              Вход в системата
            </h1>
            <p className="text-hierarchy-secondary">
              Влезте в административния панел
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Имейл адрес"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              required
            />

            <Input
              label="Парола"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e?.target?.value)}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={loading}
              className="bg-gradient-to-r from-accent to-secondary"
            >
              {loading ? 'Влизане...' : (
                <>
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Вход
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                🔐 Демо акаунти за тестване:
              </p>
              <div className="space-y-2 text-sm">
                <div className="bg-white rounded p-2">
                  <p className="text-blue-800 font-medium">Администратор:</p>
                  <p className="text-blue-700">
                    📧 elena@elenarosephotography.bg<br />
                    🔑 elena2024
                  </p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-blue-800 font-medium">Клиент:</p>
                  <p className="text-blue-700">
                    📧 maria.petrova@example.com<br />
                    🔑 maria2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-accent hover:text-secondary text-sm font-medium"
            >
              Нямате акаунт? Регистрирайте се
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;