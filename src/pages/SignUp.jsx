import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import AuthModal from '../components/AuthModal';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [focusedField, setFocusedField] = useState(null);
  const [completedFields, setCompletedFields] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(location.pathname === '/signup');

  // Sync modal state with location
  useEffect(() => {
    setIsModalOpen(location.pathname === '/signup');
  }, [location.pathname]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (formData.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^[\d\s+\-()]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    
    // Mark field as completed if it has valid value
    if (value?.trim()) {
      setCompletedFields(prev => ({ ...prev, [field]: true }));
    }
    
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
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData?.email, formData?.password, formData?.fullName, formData?.phone);
      setSuccess(true);
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err?.message || 'Registration error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400"></div>
          
          <div className="p-8 md:p-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
            >
              <Icon name="CheckCircle" size={32} className="text-white" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-heading font-bold text-sophisticated-dark mb-3"
            >
              Registration Successful!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-hierarchy-secondary mb-6"
            >
              Your account has been created successfully. You can now sign in and book your photography session.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="default"
                fullWidth
                onClick={() => navigate('/signin')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/30 text-white font-medium"
              >
                <Icon name="LogIn" size={20} className="mr-2" />
                Go to Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </AuthModal>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const formFields = [
    { name: 'fullName', label: 'Full Name', icon: 'User', type: 'text', placeholder: 'Your full name' },
    { name: 'email', label: 'Email Address', icon: 'Mail', type: 'email', placeholder: 'your@email.com' },
    { name: 'phone', label: 'Phone (optional)', icon: 'Phone', type: 'tel', placeholder: '+359 89 123 4567' },
  ];

  const modalContent = (
    <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Header gradient */}
      <div className="h-1 bg-gradient-to-r from-accent via-secondary to-accent"></div>

      <div className="p-8 md:p-10">
        {/* Logo section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
            <Icon name="UserPlus" size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-sophisticated-dark via-accent to-sophisticated-dark bg-clip-text text-transparent mb-2">
            Join Us
          </h1>
          <p className="text-hierarchy-secondary text-sm">
            Create an account and book your photography session
          </p>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 flex items-start gap-3"
            >
              <Icon name="AlertCircle" size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dynamic form fields */}
          {formFields.map((field, index) => (
            <motion.div
              key={field.name}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative group">
                <Input
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => handleChange(field.name, e?.target?.value)}
                  error={validationErrors[field.name]}
                  className="pl-10"
                  required={field.name !== 'phone'}
                />
                <motion.div
                  animate={{
                    scale: focusedField === field.name ? 1.1 : 1,
                    color: focusedField === field.name ? '#c17a5e' : completedFields[field.name] ? '#10b981' : '#9ca3af'
                  }}
                  className="absolute left-3 top-10 pointer-events-none"
                >
                  <Icon name={field.icon} size={18} />
                </motion.div>
                {completedFields[field.name] && !validationErrors[field.name] && field.name !== 'phone' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-10 text-green-500"
                  >
                    <Icon name="Check" size={18} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Password field */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={formData?.password}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleChange('password', e?.target?.value)}
                error={validationErrors.password}
                className="pl-10"
                required
              />
              <motion.div
                animate={{
                  scale: focusedField === 'password' ? 1.1 : 1,
                  color: focusedField === 'password' ? '#c17a5e' : completedFields.password ? '#10b981' : '#9ca3af'
                }}
                className="absolute left-3 top-10 pointer-events-none"
              >
                <Icon name="Lock" size={18} />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-hierarchy-secondary hover:text-accent transition-colors"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </motion.button>
              {formData.password?.length >= 6 && !validationErrors.password && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-12 top-10 text-green-500"
                >
                  <Icon name="Check" size={18} />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Confirm password field */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat the password"
                value={formData?.confirmPassword}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleChange('confirmPassword', e?.target?.value)}
                error={validationErrors.confirmPassword}
                className="pl-10"
                required
              />
              <motion.div
                animate={{
                  scale: focusedField === 'confirmPassword' ? 1.1 : 1,
                  color: focusedField === 'confirmPassword' ? '#c17a5e' : formData.confirmPassword && formData.password === formData.confirmPassword ? '#10b981' : '#9ca3af'
                }}
                className="absolute left-3 top-10 pointer-events-none"
              >
                <Icon name="Lock" size={18} />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-hierarchy-secondary hover:text-accent transition-colors"
              >
                <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={18} />
              </motion.button>
              {formData.confirmPassword && formData.password === formData.confirmPassword && !validationErrors.confirmPassword && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-12 top-10 text-green-500"
                >
                  <Icon name="Check" size={18} />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Progress indicator */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="py-2">
            <div className="flex items-center gap-2 text-xs text-hierarchy-secondary mb-2">
              <Icon name="CheckCircle" size={14} className={completedFields.fullName && completedFields.email && formData.password?.length >= 6 && formData.password === formData.confirmPassword ? 'text-green-500' : 'text-gray-300'} />
              <span>Form ready to submit</span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-secondary"
                initial={{ width: '0%' }}
                animate={{
                  width: `${
                    (Object.values(completedFields).filter(Boolean).length / 3 * 33.33) +
                    (formData.password?.length >= 6 ? 33.33 : 0) +
                    (formData.password === formData.confirmPassword && formData.confirmPassword ? 33.33 : 0)
                  }%`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Submit button */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="pt-2">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
              className="bg-gradient-to-r from-accent to-secondary hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 text-white font-medium disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                <>
                  <Icon name="UserPlus" size={20} className="mr-2" />
                  Sign Up
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Sign in link */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }} className="text-center pt-4 border-t border-border/30">
          <p className="text-sm text-hierarchy-secondary mb-2">
            Already have an account?
          </p>
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="inline-flex items-center gap-2 text-accent hover:text-secondary font-heading font-semibold transition-all duration-300 hover:gap-3"
          >
            Sign in here
            <Icon name="ArrowRight" size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <AuthModal isOpen={isModalOpen} onClose={handleCloseModal}>
      {modalContent}
    </AuthModal>
  );
};

export default SignUp;