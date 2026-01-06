import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './AppIcon';

export default function Toast({ message, type = 'info', onClose, autoClose = true, duration = 4000 }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'Check',
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'AlertTriangle',
      iconColor: 'text-red-600'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'Info',
      iconColor: 'text-blue-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'AlertCircle',
      iconColor: 'text-yellow-600'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`fixed top-6 right-6 max-w-md z-[9999] ${config.bg} border ${config.border} rounded-lg p-4 shadow-lg`}
      >
        <div className="flex items-start gap-3">
          <Icon name={config.icon} size={20} className={`flex-shrink-0 ${config.iconColor}`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${config.text}`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${config.text} hover:opacity-75 transition-opacity`}
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
