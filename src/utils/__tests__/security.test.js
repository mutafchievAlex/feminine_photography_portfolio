/**
 * Security utilities tests
 */

import {
  sanitizeInput,
  encodeHTML,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidFutureDate,
  sanitizeURL,
  detectMaliciousInput,
  validateBookingForm,
  sanitizeFormData
} from '../security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove angle brackets', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
    });

    it('should remove event handlers', () => {
      expect(sanitizeInput('onclick=alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('onerror=alert(1)')).toBe('alert(1)');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should handle non-string input', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
    });
  });

  describe('encodeHTML', () => {
    it('should encode HTML entities', () => {
      const result = encodeHTML('<script>alert("xss")</script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should handle special characters', () => {
      const result = encodeHTML('Test & "quotes" \'single\'');
      expect(result).toContain('&amp;');
      expect(result).toContain('&quot;');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });

    it('should reject emails longer than 254 chars', () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate Bulgarian phone numbers', () => {
      expect(isValidPhone('+359 87 123 4567')).toBe(true);
      expect(isValidPhone('+35987123456')).toBe(true);
      expect(isValidPhone('0871234567')).toBe(true);
      expect(isValidPhone('+359 88 999 9999')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123456')).toBe(false);
      expect(isValidPhone('+359 12 345 678')).toBe(false);
      expect(isValidPhone('invalid')).toBe(false);
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone(null)).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should validate correct names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('Мария Петрова')).toBe(true);
      expect(isValidName("O'Brien")).toBe(true);
      expect(isValidName('Jean-Pierre')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('A')).toBe(false); // Too short
      expect(isValidName('John123')).toBe(false); // Numbers
      expect(isValidName('John@Doe')).toBe(false); // Special chars
      expect(isValidName('')).toBe(false);
      expect(isValidName(null)).toBe(false);
    });

    it('should reject names longer than 50 chars', () => {
      const longName = 'a'.repeat(51);
      expect(isValidName(longName)).toBe(false);
    });
  });

  describe('isValidFutureDate', () => {
    it('should validate future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isValidFutureDate(tomorrow.toISOString())).toBe(true);
    });

    it('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isValidFutureDate(yesterday.toISOString())).toBe(false);
    });

    it('should accept today', () => {
      const today = new Date();
      expect(isValidFutureDate(today.toISOString())).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidFutureDate('invalid')).toBe(false);
      expect(isValidFutureDate(null)).toBe(false);
    });
  });

  describe('sanitizeURL', () => {
    it('should allow relative URLs', () => {
      expect(sanitizeURL('/path/to/page')).toBe('/path/to/page');
      expect(sanitizeURL('/gallery')).toBe('/gallery');
    });

    it('should allow same-origin URLs', () => {
      const url = `${window.location.origin}/page`;
      expect(sanitizeURL(url)).toBe(url);
    });

    it('should reject javascript: protocol', () => {
      expect(sanitizeURL('javascript:alert(1)')).toBe('');
    });

    it('should reject data: protocol', () => {
      expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('should reject external URLs by default', () => {
      expect(sanitizeURL('https://evil.com')).toBe('');
    });
  });

  describe('detectMaliciousInput', () => {
    it('should detect script tags', () => {
      expect(detectMaliciousInput('<script>alert(1)</script>')).toBe(true);
      expect(detectMaliciousInput('<SCRIPT>alert(1)</SCRIPT>')).toBe(true);
    });

    it('should detect javascript: protocol', () => {
      expect(detectMaliciousInput('javascript:alert(1)')).toBe(true);
      expect(detectMaliciousInput('JAVASCRIPT:alert(1)')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(detectMaliciousInput('onclick=alert(1)')).toBe(true);
      expect(detectMaliciousInput('onerror=alert(1)')).toBe(true);
    });

    it('should detect iframe tags', () => {
      expect(detectMaliciousInput('<iframe src="evil.com"></iframe>')).toBe(true);
    });

    it('should detect eval function', () => {
      expect(detectMaliciousInput('eval(maliciousCode)')).toBe(true);
    });

    it('should not flag normal input', () => {
      expect(detectMaliciousInput('Hello, this is normal text')).toBe(false);
      expect(detectMaliciousInput('email@example.com')).toBe(false);
    });

    it('should handle non-string input', () => {
      expect(detectMaliciousInput(123)).toBe(false);
      expect(detectMaliciousInput(null)).toBe(false);
    });
  });

  describe('validateBookingForm', () => {
    const validFormData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+359 87 123 4567',
      selectedDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      vision: 'My vision',
      inspiration: 'My inspiration',
      specialRequests: 'Special requests'
    };

    it('should validate correct form data', () => {
      const result = validateBookingForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should reject invalid name', () => {
      const result = validateBookingForm({ ...validFormData, fullName: 'A' });
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBeDefined();
    });

    it('should reject invalid email', () => {
      const result = validateBookingForm({ ...validFormData, email: 'notanemail' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it('should reject invalid phone', () => {
      const result = validateBookingForm({ ...validFormData, phone: '123' });
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBeDefined();
    });

    it('should reject past date', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const result = validateBookingForm({ ...validFormData, selectedDate: yesterday });
      expect(result.isValid).toBe(false);
      expect(result.errors.selectedDate).toBeDefined();
    });

    it('should reject text fields longer than 1000 chars', () => {
      const longText = 'a'.repeat(1001);
      const result = validateBookingForm({ ...validFormData, vision: longText });
      expect(result.isValid).toBe(false);
      expect(result.errors.vision).toBeDefined();
    });
  });

  describe('sanitizeFormData', () => {
    it('should sanitize all string fields', () => {
      const formData = {
        name: '<script>alert(1)</script>',
        email: 'test@example.com',
        phone: '+359871234567',
        number: 123
      };

      const result = sanitizeFormData(formData);
      expect(result.name).not.toContain('<script>');
      expect(result.email).toBe('test@example.com');
      expect(result.number).toBe(123);
    });

    it('should preserve non-string values', () => {
      const formData = {
        text: 'hello',
        number: 42,
        boolean: true,
        date: new Date()
      };

      const result = sanitizeFormData(formData);
      expect(result.text).toBe('hello');
      expect(result.number).toBe(42);
      expect(result.boolean).toBe(true);
      expect(result.date).toBeInstanceOf(Date);
    });
  });
});
