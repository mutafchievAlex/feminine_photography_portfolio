/**
 * Security utilities for input validation, sanitization, and protection
 */

// XSS Protection - sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters and scripts
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers
    .trim();
};

// HTML encode to prevent XSS
export const encodeHTML = (str) => {
  if (typeof str !== 'string') return str;
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// Validate email format
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate phone number (Bulgarian format)
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove spaces and common separators
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Bulgarian phone numbers: +359 XX XXX XXXX or 08X XXX XXXX
  const phoneRegex = /^(\+359|0)8[789]\d{7}$/;
  return phoneRegex.test(cleaned);
};

// Validate name (only letters, spaces, hyphens)
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']{2,50}$/;
  return nameRegex.test(name.trim());
};

// Validate date format and ensure it's not in the past
export const isValidFutureDate = (date) => {
  if (!date) return false;
  
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return inputDate instanceof Date && !isNaN(inputDate) && inputDate >= today;
};

// Sanitize URL to prevent open redirect attacks
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    // Check if it's a relative URL or from same origin
    if (url.startsWith('/') || parsed.origin === window.location.origin) {
      return url;
    }
    
    // For external URLs, return only if explicitly allowed
    return '';
  } catch {
    // If URL parsing fails, treat as relative path
    return url.startsWith('/') ? url : '';
  }
};

// Rate limiting helper (client-side)
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Filter out attempts outside the time window
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  reset(key) {
    this.attempts.delete(key);
  }
}

// Create rate limiters for different actions
export const loginRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes
export const bookingRateLimiter = new RateLimiter(3, 60000); // 3 attempts per minute
export const apiRateLimiter = new RateLimiter(30, 60000); // 30 requests per minute

// CSRF Token generation and validation
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const setCSRFToken = () => {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

export const getCSRFToken = () => {
  let token = sessionStorage.getItem('csrf_token');
  if (!token) {
    token = setCSRFToken();
  }
  return token;
};

export const validateCSRFToken = (token) => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken && token === storedToken;
};

// Content Security Policy helper
export const applyCSP = () => {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  document.head.appendChild(meta);
};

// Validate form data comprehensively
export const validateBookingForm = (formData) => {
  const errors = {};

  // Validate required fields
  if (!formData.fullName || !isValidName(formData.fullName)) {
    errors.fullName = 'Невалидно име. Моля използвайте само букви.';
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Невалиден имейл адрес.';
  }

  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = 'Невалиден телефонен номер. Използвайте формат: +359 XX XXX XXXX';
  }

  if (!formData.selectedDate || !isValidFutureDate(formData.selectedDate)) {
    errors.selectedDate = 'Моля изберете бъдеща дата.';
  }

  // Validate optional text fields length
  if (formData.vision && formData.vision.length > 1000) {
    errors.vision = 'Текстът е твърде дълъг (максимум 1000 символа).';
  }

  if (formData.inspiration && formData.inspiration.length > 1000) {
    errors.inspiration = 'Текстът е твърде дълъг (максимум 1000 символа).';
  }

  if (formData.specialRequests && formData.specialRequests.length > 1000) {
    errors.specialRequests = 'Текстът е твърде дълъг (максимум 1000 символа).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitize all form data
export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Prevent clickjacking
export const preventClickjacking = () => {
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }
};

// Secure session storage
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store item securely:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to retrieve item securely:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    sessionStorage.removeItem(key);
  }
};

// Check for common attack patterns in input
export const detectMaliciousInput = (input) => {
  if (typeof input !== 'string') return false;
  
  const patterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi, // Script tags
    /javascript:/gi, // JavaScript protocol
    /on\w+\s*=/gi, // Event handlers
    /<iframe/gi, // Iframe tags
    /eval\(/gi, // Eval function
    /expression\(/gi, // CSS expressions
    /vbscript:/gi, // VBScript protocol
    /data:text\/html/gi, // Data URLs
  ];
  
  return patterns.some(pattern => pattern.test(input));
};

export default {
  sanitizeInput,
  encodeHTML,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidFutureDate,
  sanitizeURL,
  loginRateLimiter,
  bookingRateLimiter,
  apiRateLimiter,
  generateCSRFToken,
  setCSRFToken,
  getCSRFToken,
  validateCSRFToken,
  applyCSP,
  validateBookingForm,
  sanitizeFormData,
  preventClickjacking,
  secureStorage,
  detectMaliciousInput
};
