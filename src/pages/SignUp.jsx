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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName?.trim()) {
      errors.fullName = 'Името е задължително';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Имейлът е задължителен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Невалиден имейл адрес';
    }

    if (formData.password?.length < 6) {
      errors.password = 'Паролата трябва да бъде поне 6 символа';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Паролите не съвпадат';
    }

    if (formData.phone && !/^[\d\s+\-()]+$/.test(formData.phone)) {
      errors.phone = 'Невалиден телефонен номер';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Моля коригирайте грешките в формата');
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
                Вашият акаунт е създаден. Можете да влезете с вашите учетни данни.
              </p>
              <Button
                variant="default"
                fullWidth
                onClick={() => navigate('/signin')}
                className="bg-gradient-to-r from-accent to-secondary"
              >
                <Icon name="LogIn" size={20} className="mr-2" />
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
              <p className="text-red-800 text-sm flex items-start gap-2">
                <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Пълно име"
              type="text"
              placeholder="Вашето име"
              value={formData?.fullName}
              onChange={(e) => handleChange('fullName', e?.target?.value)}
              error={validationErrors.fullName}
              required
            />

            <Input
              label="Имейл адрес"
              type="email"
              placeholder="your@email.com"
              value={formData?.email}
              onChange={(e) => handleChange('email', e?.target?.value)}
              error={validationErrors.email}
              required
            />

            <Input
              label="Телефон (опционално)"
              type="tel"
              placeholder="+359 89 123 4567"
              value={formData?.phone}
              onChange={(e) => handleChange('phone', e?.target?.value)}
              error={validationErrors.phone}
            />

            <div>
              <div className="relative">
                <Input
                  label="Парола"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Минимум 6 символа"
                  value={formData?.password}
                  onChange={(e) => handleChange('password', e?.target?.value)}
                  error={validationErrors.password}
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
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Потвърдете паролата"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Повторете паролата"
                  value={formData?.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e?.target?.value)}
                  error={validationErrors.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-hierarchy-secondary hover:text-sophisticated-dark"
                >
                  <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={loading}
              className="bg-gradient-to-r from-accent to-secondary mt-6"
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
              className="text-accent hover:text-secondary text-sm font-medium transition-colors"
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