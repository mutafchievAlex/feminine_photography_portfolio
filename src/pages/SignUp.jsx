import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (formData?.password !== formData?.confirmPassword) {
      setError('Паролите не съвпадат');
      return;
    }

    if (formData?.password?.length < 6) {
      setError('Паролата трябва да бъде поне 6 символа');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData?.email, formData?.password, formData?.fullName, formData?.phone);
      setSuccess(true);
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err?.message || 'Грешка при регистрация. Моля опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gallery-canvas flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-background rounded-xl shadow-soft border border-border p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-sophisticated-dark mb-4">
                Регистрацията е успешна!
              </h2>
              <p className="text-hierarchy-secondary mb-6">
                Моля проверете вашия имейл за потвърждаване на акаунта.
              </p>
              <Button
                variant="default"
                fullWidth
                onClick={() => navigate('/signin')}
              >
                Към вход
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gallery-canvas flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-background rounded-xl shadow-soft border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-sophisticated-dark mb-2">
              Регистрация
            </h1>
            <p className="text-hierarchy-secondary">
              Създайте акаунт за резервация на фотосесия
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Пълно име"
              type="text"
              placeholder="Вашето име"
              value={formData?.fullName}
              onChange={(e) => handleChange('fullName', e?.target?.value)}
              required
            />

            <Input
              label="Имейл адрес"
              type="email"
              placeholder="your@email.com"
              value={formData?.email}
              onChange={(e) => handleChange('email', e?.target?.value)}
              required
            />

            <Input
              label="Телефон"
              type="tel"
              placeholder="+359 XXX XXX XXX"
              value={formData?.phone}
              onChange={(e) => handleChange('phone', e?.target?.value)}
            />

            <Input
              label="Парола"
              type="password"
              placeholder="Минимум 6 символа"
              value={formData?.password}
              onChange={(e) => handleChange('password', e?.target?.value)}
              required
            />

            <Input
              label="Потвърдете паролата"
              type="password"
              placeholder="Повторете паролата"
              value={formData?.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e?.target?.value)}
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
              {loading ? 'Регистрация...' : (
                <>
                  <Icon name="UserPlus" size={20} className="mr-2" />
                  Регистрация
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="text-accent hover:text-secondary text-sm font-medium"
            >
              Вече имате акаунт? Влезте
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;