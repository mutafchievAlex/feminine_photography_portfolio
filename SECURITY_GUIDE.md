# 🔒 Security Implementation Guide

Този документ описва всички имплементирани защитни механизми за сайта.

## 📋 Съдържание

1. [Преглед на защитите](#преглед-на-защитите)
2. [Input Validation & Sanitization](#input-validation--sanitization)
3. [XSS Protection](#xss-protection)
4. [CSRF Protection](#csrf-protection)
5. [Rate Limiting](#rate-limiting)
6. [Authentication Security](#authentication-security)
7. [HTTP Security Headers](#http-security-headers)
8. [Best Practices](#best-practices)

## 🛡️ Преглед на защитите

Имплементирани са следните защитни механизми:

- ✅ Input validation и sanitization
- ✅ XSS (Cross-Site Scripting) защита
- ✅ CSRF (Cross-Site Request Forgery) токени
- ✅ Rate limiting за login и API заявки
- ✅ Password strength validation
- ✅ Secure session storage
- ✅ HTTP Security Headers (CSP, X-Frame-Options, etc.)
- ✅ Clickjacking protection
- ✅ Malicious input detection

## 🔍 Input Validation & Sanitization

### Локация
`src/utils/security.js`

### Функции

#### `sanitizeInput(input)`
Премахва опасни символи и скриптове от потребителски вход.

```javascript
import { sanitizeInput } from '../utils/security';

const cleanInput = sanitizeInput(userInput);
```

#### `isValidEmail(email)`
Валидира имейл адрес според RFC 5322.

```javascript
if (!isValidEmail(email)) {
  throw new Error('Невалиден имейл адрес');
}
```

#### `isValidPhone(phone)`
Валидира български телефонен номер.

```javascript
if (!isValidPhone(phone)) {
  throw new Error('Невалиден телефонен номер');
}
```

#### `isValidName(name)`
Валидира имена (само букви, интервали, тирета).

```javascript
if (!isValidName(fullName)) {
  throw new Error('Невалидно име');
}
```

#### `isValidFutureDate(date)`
Проверява дали датата е валидна и в бъдещето.

```javascript
if (!isValidFutureDate(selectedDate)) {
  throw new Error('Моля изберете бъдеща дата');
}
```

### Използване в форми

Всички форми използват `validateBookingForm()` и `sanitizeFormData()`:

```javascript
import { validateBookingForm, sanitizeFormData } from '../utils/security';

const { isValid, errors } = validateBookingForm(formData);
if (isValid) {
  const sanitized = sanitizeFormData(formData);
  onSubmit(sanitized);
}
```

## 🚫 XSS Protection

### Content Security Policy (CSP)

CSP се прилага автоматично в `App.jsx`:

```javascript
import { applyCSP } from './utils/security';

useEffect(() => {
  applyCSP();
}, []);
```

### Защита срещу malicious input

```javascript
import { detectMaliciousInput } from '../utils/security';

if (detectMaliciousInput(userInput)) {
  throw new Error('Невалидни данни');
}
```

Автоматично се проверява за:
- `<script>` тагове
- JavaScript protocols (`javascript:`, `vbscript:`)
- Event handlers (`onclick=`, `onerror=`, etc.)
- `<iframe>` тагове
- `eval()` функции
- Data URLs

## 🔐 CSRF Protection

### Генериране на токени

CSRF токените се генерират автоматично при зареждане на приложението:

```javascript
import { setCSRFToken, getCSRFToken } from './utils/security';

// В App.jsx
useEffect(() => {
  setCSRFToken();
}, []);
```

### Автоматично добавяне към заявки

API клиентите автоматично добавят CSRF токен към всички POST/PUT/DELETE заявки:

```javascript
// В src/api/client.js
apiClient.interceptors.request.use((config) => {
  if (config.method !== 'get') {
    config.headers['X-CSRF-Token'] = getCSRFToken();
  }
  return config;
});
```

## ⏱️ Rate Limiting

### Client-side Rate Limiting

Имплементирани са три типа rate limiters:

#### 1. Login Rate Limiter
- **Лимит**: 5 опита на 5 минути
- **Локация**: Authentication

```javascript
import { loginRateLimiter } from '../utils/security';

if (!loginRateLimiter.isAllowed(email)) {
  throw new Error('Твърде много опити. Изчакайте 5 минути.');
}
```

#### 2. Booking Rate Limiter
- **Лимит**: 3 заявки на минута
- **Локация**: Booking форма

```javascript
import { bookingRateLimiter } from '../utils/security';

if (!bookingRateLimiter.isAllowed('booking-form')) {
  setError('Твърде много опити. Изчакайте минута.');
  return;
}
```

#### 3. API Rate Limiter
- **Лимит**: 30 заявки на минута
- **Локация**: API клиенти
- **Автоматично**: Проверява се във всички API заявки

### Персонализиране на Rate Limiting

```javascript
import { RateLimiter } from '../utils/security';

// Нов custom rate limiter
const customLimiter = new RateLimiter(10, 60000); // 10 заявки на минута

if (customLimiter.isAllowed('unique-key')) {
  // Позволи действието
}
```

## 🔑 Authentication Security

### Password Strength Validation

Паролите се валидират за:
- Минимум 8 символа
- Поне една главна буква
- Поне една малка буква
- Поне една цифра

```javascript
// В AuthContext.jsx
const validatePasswordStrength = (password) => {
  // ... validation logic
};
```

### Secure Session Storage

Вместо localStorage, се използва криптиран sessionStorage:

```javascript
import { secureStorage } from '../utils/security';

// Запазване
secureStorage.setItem('key', data);

// Извличане
const data = secureStorage.getItem('key');

// Изтриване
secureStorage.removeItem('key');
```

### Input Sanitization при Login/Register

Всички входни данни се sanitize преди обработка:

```javascript
const cleanEmail = sanitizeInput(email.toLowerCase().trim());
const cleanFullName = sanitizeInput(fullName.trim());
```

### Автоматично logout при 401

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      localStorage.removeItem('mockAuthSession');
    }
    return Promise.reject(error);
  }
);
```

## 🛡️ HTTP Security Headers

Следните security headers се добавят автоматично:

### 1. Content-Security-Policy
Ограничава източниците на скриптове, стилове и изображения.

### 2. X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
Предотвратява MIME type sniffing.

### 3. X-Frame-Options
```
X-Frame-Options: DENY
```
Предотвратява clickjacking атаки.

### 4. X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
Активира built-in XSS защита на браузъра.

### 5. Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
Контролира Referer header информацията.

### 6. Permissions-Policy
```
Permissions-Policy: camera=(), microphone=(), geolocation=()
```
Ограничава достъпа до browser APIs.

### Имплементация

Headers се добавят автоматично в `App.jsx`:

```javascript
useEffect(() => {
  const metaTags = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    // ... други headers
  ];

  metaTags.forEach(({ httpEquiv, content }) => {
    const meta = document.createElement('meta');
    meta.httpEquiv = httpEquiv;
    meta.content = content;
    document.head.appendChild(meta);
  });
}, []);
```

## 🔧 Vite Configuration Security

Добавете следното в `vite.config.mjs`:

```javascript
export default defineConfig({
  server: {
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
});
```

## 📝 Best Practices

### 1. Винаги използвайте security utilities

❌ **Грешно:**
```javascript
const email = formData.email;
await submitForm(formData);
```

✅ **Правилно:**
```javascript
import { sanitizeInput, isValidEmail, sanitizeFormData } from '../utils/security';

const email = sanitizeInput(formData.email);
if (!isValidEmail(email)) {
  throw new Error('Невалиден имейл');
}

const sanitized = sanitizeFormData(formData);
await submitForm(sanitized);
```

### 2. Проверявайте rate limiting

```javascript
if (!rateLimiter.isAllowed(key)) {
  return showError('Твърде много заявки');
}
```

### 3. Използвайте HTTPS в production

Уверете се, че `.env.production` използва HTTPS:

```env
VITE_API_URL=https://your-api.com
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### 4. Никога не съхранявайте чувствителна информация в localStorage

❌ **Грешно:**
```javascript
localStorage.setItem('password', password);
localStorage.setItem('token', token);
```

✅ **Правилно:**
```javascript
import { secureStorage } from '../utils/security';
secureStorage.setItem('session', sessionData);
```

### 5. Валидирайте на frontend И backend

Client-side валидацията не е достатъчна. Винаги валидирайте и на сървъра.

### 6. Логвайте security events

```javascript
if (detectMaliciousInput(input)) {
  console.warn('Malicious input detected:', { 
    timestamp: new Date(),
    input: input.substring(0, 50) // Само началото
  });
  throw new Error('Невалидни данни');
}
```

## 🚨 Security Checklist

Преди production deployment:

- [ ] HTTPS е активиран
- [ ] Environment variables са защитени
- [ ] CORS е правилно конфигуриран
- [ ] Rate limiting е активиран на backend
- [ ] Supabase Row Level Security (RLS) е конфигуриран
- [ ] API keys не са в кода
- [ ] Security headers са добавени
- [ ] Input validation е на всички форми
- [ ] CSRF защита е активна
- [ ] Session timeout е конфигуриран

## 📚 Допълнителни ресурси

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## 🆘 Support

При въпроси или проблеми със security:
1. Прегледайте този документ
2. Проверете логовете в browser console
3. Тествайте с различни входни данни
4. Използвайте security testing tools (напр. OWASP ZAP)

---

**Последна актуализация**: Януари 2026
**Версия**: 1.0
