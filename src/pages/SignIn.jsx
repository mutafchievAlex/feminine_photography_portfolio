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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Моля попълнете имейл и парола');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email, password);
      
      // Determine role and navigate accordingly
      const userRole = result?.user?.user_metadata?.role || 'client';
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/homepage');
      }
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
              Влезте в административния панел или профила
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
              onChange={(e) => {
                setEmail(e?.target?.value);
                setError('');
              }}
              required
            />

            <div className="relative">
              <Input
                label="Парола"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e?.target?.value);
                  setError('');
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-hierarchy-secondary hover:text-sophisticated-dark"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>

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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-blue-900 mb-3">
                🔐 Демо акаунти за тестване:
              </p>
              <div className="space-y-2 text-sm">
                <div className="bg-white rounded p-3 border border-blue-100">
                  <p className="text-blue-800 font-medium mb-1">Администратор:</p>
                  <p className="text-blue-700 text-xs space-y-1">
                    <div>📧 <code className="bg-blue-50 px-2 py-1 rounded">elena@elenarosephotography.bg</code></div>
                    <div>🔑 <code className="bg-blue-50 px-2 py-1 rounded">elena2024</code></div>
                  </p>
                </div>
                <div className="bg-white rounded p-3 border border-blue-100">
                  <p className="text-blue-800 font-medium mb-1">Клиент:</p>
                  <p className="text-blue-700 text-xs space-y-1">
                    <div>📧 <code className="bg-blue-50 px-2 py-1 rounded">maria.petrova@example.com</code></div>
                    <div>🔑 <code className="bg-blue-50 px-2 py-1 rounded">maria2024</code></div>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                ✅ Можете също да се регистрирате с нов акаунт като клиент
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-accent hover:text-secondary text-sm font-medium transition-colors"
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