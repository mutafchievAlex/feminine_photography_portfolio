import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import AuthModal from '../components/AuthModal';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(location.pathname === '/signin');

  // Sync modal state with location
  useEffect(() => {
    setIsModalOpen(location.pathname === '/signin');
  }, [location.pathname]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email, password);
      const userRole = result?.user?.user_metadata?.role || 'client';
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/homepage');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err?.message || 'Sign in error. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

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
            <Icon name="Camera" size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-sophisticated-dark via-accent to-sophisticated-dark bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-hierarchy-secondary text-sm">
            Sign in to your account or admin panel
          </p>
        </motion.div>

        {/* Error message with animation */}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={email}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => {
                  setEmail(e?.target?.value);
                  setError('');
                }}
                required
                className="pl-10"
              />
              <motion.div
                animate={{
                  scale: focusedField === 'email' ? 1.1 : 1,
                  color: focusedField === 'email' ? '#c17a5e' : '#9ca3af'
                }}
                className="absolute left-3 top-10 pointer-events-none"
              >
                <Icon name="Mail" size={18} />
              </motion.div>
            </div>
          </motion.div>

          {/* Password field */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => {
                  setPassword(e?.target?.value);
                  setError('');
                }}
                required
                className="pl-10"
              />
              <motion.div
                animate={{
                  scale: focusedField === 'password' ? 1.1 : 1,
                  color: focusedField === 'password' ? '#c17a5e' : '#9ca3af'
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
            </div>
          </motion.div>

          {/* Submit button */}
          <motion.div variants={itemVariants} className="pt-2">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              className="bg-gradient-to-r from-accent to-secondary hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 text-white font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <>
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gradient-to-br from-gallery-canvas via-background to-gallery-canvas text-hierarchy-secondary text-xs font-medium">
              DEMO ACCOUNTS
            </span>
          </div>
        </div>

        {/* Demo credentials section */}
        <motion.div
          variants={itemVariants}
          className="space-y-3 mb-6"
        >
          {/* Admin demo */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-300">
            <p className="text-xs font-heading font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Icon name="Shield" size={14} />
              ADMINISTRATOR
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                <span className="text-blue-700">📧 elena@elenarosephotography.bg</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('elena@elenarosephotography.bg');
                    setPassword('elena2024');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                >
                  Fill
                </button>
              </div>
              <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                <span className="text-blue-700">🔑 elena2024</span>
              </div>
            </div>
          </div>

          {/* Client demo */}
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-4 hover:shadow-lg hover:shadow-green-200/30 transition-all duration-300">
            <p className="text-xs font-heading font-semibold text-green-900 mb-2 flex items-center gap-2">
              <Icon name="User" size={14} />
              CLIENT
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                <span className="text-green-700">📧 maria.petrova@example.com</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('maria.petrova@example.com');
                    setPassword('maria2024');
                  }}
                  className="text-green-600 hover:text-green-800 font-medium text-xs"
                >
                  Fill
                </button>
              </div>
              <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                <span className="text-green-700">🔑 maria2024</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign up link */}
        <motion.div variants={itemVariants} className="text-center pt-4 border-t border-border/30">
          <p className="text-sm text-hierarchy-secondary mb-2">
            Don't have an account?
          </p>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 text-accent hover:text-secondary font-heading font-semibold transition-all duration-300 hover:gap-3"
          >
            Sign up now
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

export default SignIn;