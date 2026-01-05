# 🔒 Security Quick Start

Бърз старт за имплементираните security мерки в проекта.

## 📦 Инсталация

Security utilities са вградени в проекта. Не е нужна допълнителна инсталация.

## 🚀 Основно използване

### 1. Валидация на форми

```javascript
import { validateBookingForm, sanitizeFormData } from '../utils/security';

const handleSubmit = (formData) => {
  // Валидирай формата
  const { isValid, errors } = validateBookingForm(formData);
  
  if (!isValid) {
    setErrors(errors);
    return;
  }
  
  // Санитизирай данните
  const cleanData = sanitizeFormData(formData);
  
  // Изпрати безопасни данни
  submitToAPI(cleanData);
};
```

### 2. Защита на API заявки

API клиентите автоматично добавят security:

```javascript
import apiClient from './api/client';

// Автоматично добавя:
// - CSRF токен
// - Rate limiting
// - Input sanitization
const response = await apiClient.post('/api/bookings', data);
```

### 3. Rate Limiting

```javascript
import { bookingRateLimiter } from '../utils/security';

if (!bookingRateLimiter.isAllowed('booking-action')) {
  showError('Твърде много заявки. Моля изчакайте.');
  return;
}

// Продължи с действието
processBooking();
```

### 4. Валидация на Input

```javascript
import { isValidEmail, isValidPhone, sanitizeInput } from '../utils/security';

// Email validation
if (!isValidEmail(email)) {
  throw new Error('Невалиден имейл');
}

// Phone validation
if (!isValidPhone(phone)) {
  throw new Error('Невалиден телефон');
}

// Sanitize text
const cleanText = sanitizeInput(userInput);
```

## 🛡️ Автоматични защити

Следните защити се прилагат автоматично при стартиране:

✅ **CSRF токени** - генерират се в App.jsx  
✅ **Security headers** - добавят се в App.jsx  
✅ **Clickjacking protection** - активна винаги  
✅ **Rate limiting** - на всички API заявки  
✅ **Input sanitization** - на всички API заявки  

## 🔧 Конфигурация

### Environment Variables

Копирайте `.env.security.example` към `.env`:

```bash
cp .env.security.example .env
```

Редактирайте `.env` с вашите credentials:

```env
VITE_API_URL=https://your-api.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key
```

### Production Deployment

За production, използвайте включената nginx конфигурация:

```bash
sudo cp nginx.security.conf /etc/nginx/sites-available/feminine-photography
sudo ln -s /etc/nginx/sites-available/feminine-photography /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 📝 Чести задачи

### Добави валидация към нова форма

```javascript
import { 
  sanitizeInput, 
  detectMaliciousInput,
  isValidEmail 
} from '../utils/security';

const validateMyForm = (data) => {
  const errors = {};
  
  // Email validation
  if (!isValidEmail(data.email)) {
    errors.email = 'Невалиден имейл';
  }
  
  // Check for malicious input
  if (detectMaliciousInput(data.message)) {
    errors.message = 'Невалидни данни';
  }
  
  // Sanitize all text fields
  const clean = {
    ...data,
    message: sanitizeInput(data.message)
  };
  
  return { errors, clean };
};
```

### Добави rate limiting към действие

```javascript
import { RateLimiter } from '../utils/security';

// Създай custom rate limiter
const myLimiter = new RateLimiter(10, 60000); // 10 заявки/минута

const handleAction = () => {
  if (!myLimiter.isAllowed('my-action-key')) {
    alert('Твърде много заявки');
    return;
  }
  
  // Продължи с действието
};
```

### Използвай secure storage

```javascript
import { secureStorage } from '../utils/security';

// Запази данни
secureStorage.setItem('userData', { name: 'John' });

// Вземи данни
const userData = secureStorage.getItem('userData');

// Изтрий данни
secureStorage.removeItem('userData');
```

## 🧪 Тестване

Пусни security тестовете:

```bash
npm test src/utils/__tests__/security.test.js
```

## 📚 Пълна документация

За подробна документация, вижте [SECURITY_GUIDE.md](./SECURITY_GUIDE.md)

## ⚠️ Security Checklist

Преди production:

- [ ] `.env` файлът не е в Git
- [ ] HTTPS е активиран
- [ ] SSL сертификат е валиден
- [ ] Nginx security headers са конфигурирани
- [ ] Supabase RLS политики са настроени
- [ ] Rate limiting е тестван
- [ ] Security тестовете минават

## 🆘 Проблеми

### Rate limiting блокира валидни заявки

```javascript
// Resetни rate limiter
import { bookingRateLimiter } from '../utils/security';
bookingRateLimiter.reset('key');
```

### CSRF токен липсва

```javascript
// Регенерирай CSRF токен
import { setCSRFToken } from '../utils/security';
setCSRFToken();
```

### Форма не се изпраща

Проверете browser console за валидационни грешки. Валидацията е строга по дизайн.

## 📞 Контакт

При security въпроси или проблеми, вижте пълната документация в `SECURITY_GUIDE.md`.

---

**Важно**: Винаги тествайте security промени локално преди production deployment!
