# Feminine Photography Portfolio

A modern, secure React-based photography portfolio and booking platform with comprehensive security measures.

## 🚀 Features

- **React 18** - Latest React with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Supabase** - Backend as a Service with authentication and database
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup
- **🔒 Security** - Comprehensive security implementation (see below)

## 🔐 Security Features

This project implements **enterprise-level security measures**:

### ✅ Implemented Protections
- **XSS Protection** - Input sanitization, CSP headers, malicious code detection
- **CSRF Protection** - Automatic token generation and validation
- **Rate Limiting** - Client and server-side request throttling
- **Input Validation** - Email, phone, name, date validation with RFC compliance
- **Authentication Security** - Password strength validation, secure session storage
- **HTTP Security Headers** - X-Frame-Options, CSP, HSTS, and more
- **Clickjacking Prevention** - Frame-busting and X-Frame-Options
- **Session Security** - Encrypted storage, automatic cleanup

### 📚 Security Documentation
- [Security Quick Start](SECURITY_QUICK_START.md) - Get started quickly
- [Security Guide](SECURITY_GUIDE.md) - Comprehensive documentation
- [Security Architecture](SECURITY_ARCHITECTURE.md) - System architecture
- [Security Summary](SECURITY_IMPLEMENTATION_SUMMARY.md) - Implementation details

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Supabase account (for production) or mock mode for development

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd feminine_photography_portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.security.example .env
   # Edit .env with your credentials
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:4028`

## 📁 Project Structure

```
feminine_photography_portfolio/
├── public/                    # Static assets
├── src/
│   ├── api/                   # API clients with security
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React contexts (Auth, Theme, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Third-party library configs
│   ├── pages/                 # Page components
│   ├── services/              # Business logic services
│   ├── styles/                # Global styles
│   ├── utils/                 # Utility functions
│   │   └── security.js        # 🔒 Security utilities
│   ├── App.jsx                # Main application
│   ├── Routes.jsx             # Application routes
│   └── index.jsx              # Entry point
├── supabase/                  # Database migrations
├── .env.security.example      # Environment template
├── nginx.security.conf        # Production nginx config
├── SECURITY_*.md              # Security documentation
└── package.json               # Dependencies
```

## 🔒 Security Usage

### Quick Example

```javascript
import { 
  sanitizeInput, 
  validateBookingForm, 
  bookingRateLimiter 
} from './utils/security';

// Validate and sanitize form data
const handleSubmit = (formData) => {
  // Check rate limiting
  if (!bookingRateLimiter.isAllowed('booking')) {
    return showError('Too many requests');
  }
  
  // Validate form
  const { isValid, errors } = validateBookingForm(formData);
  if (!isValid) {
    return showErrors(errors);
  }
  
  // Sanitize data
  const clean = sanitizeFormData(formData);
  
  // Submit
  await submitBooking(clean);
};
```

See [SECURITY_QUICK_START.md](SECURITY_QUICK_START.md) for more examples.

## 🧩 Key Pages & Features

### User-Facing Pages
- **Homepage** - Hero gallery, featured work, testimonials
- **Gallery** - Organized photo albums with categories
- **Investment** - Photography packages and pricing
- **Booking** - Consultation booking with date picker
- **About** - Photographer bio and story

### Admin Pages (Protected)
- **Admin Dashboard** - Analytics and overview
- **Album Management** - Create and manage photo albums
- **Bookings** - View and manage client bookings

## 🎨 Styling

This project uses Tailwind CSS with custom configuration:
- Forms plugin for form styling
- Typography plugin for text styling
- Custom color palette for feminine aesthetic
- Responsive design utilities
- Animation utilities via Framer Motion

## 🧪 Testing

Run tests:
```bash
# All tests
npm test

# Security tests specifically
npm test src/utils/__tests__/security.test.js

# Watch mode
npm test -- --watch
```

## 📱 Responsive Design

Built mobile-first with Tailwind CSS breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 📦 Production Deployment

### Build

```bash
npm run build
```

The production build will be in the `build/` directory.

### Nginx Setup

1. Copy the security configuration:
   ```bash
   sudo cp nginx.security.conf /etc/nginx/sites-available/feminine-photography
   sudo ln -s /etc/nginx/sites-available/feminine-photography /etc/nginx/sites-enabled/
   ```

2. Update the configuration with your domain and SSL certificate paths

3. Test and reload nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Environment Variables

Ensure these are set in production:

```env
VITE_API_URL=https://your-api.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

See [.env.security.example](.env.security.example) for complete list.

### Security Checklist

Before going live:

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables configured
- [ ] Nginx security headers active
- [ ] Supabase RLS policies configured
- [ ] Rate limiting tested
- [ ] Security tests passing (`npm test`)
- [ ] No console.log statements in production code
- [ ] Error monitoring configured

See [SECURITY_GUIDE.md](SECURITY_GUIDE.md) for detailed checklist.

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm test -- --watch  # Run tests in watch mode
```

### Mock Mode

For development without Supabase:

```env
VITE_SUPABASE_URL=https://dummy.supabase.co
VITE_SUPABASE_ANON_KEY=dummy-key
```

Demo accounts will be available:
- **Admin**: `admin95` / `admin95`
- **Client**: `maria.petrova@example.com` / `maria2024`

## 🐛 Troubleshooting

### Rate Limiting Issues

If you're getting "Too many requests" errors:

```javascript
import { bookingRateLimiter } from './utils/security';
bookingRateLimiter.reset('your-key');
```

### CSRF Token Issues

If requests are failing with CSRF errors:

```javascript
import { setCSRFToken } from './utils/security';
setCSRFToken(); // Regenerate token
```

### Build Errors

Clear cache and rebuild:

```bash
rm -rf node_modules build
npm install
npm run build
```

## 📚 Documentation

- [CMS Guide](CMS_GUIDE.md) - Content management instructions
- [Admin Setup](ADMIN_SETUP.md) - Admin panel configuration
- [Hero Gallery Setup](HERO_GALLERY_SETUP.md) - Gallery configuration
- [Supabase Setup](SUPABASE_SETUP.md) - Database setup
- [Security Guide](SECURITY_GUIDE.md) - 🔒 Comprehensive security docs
- [Security Quick Start](SECURITY_QUICK_START.md) - 🔒 Quick security reference
- [Security Architecture](SECURITY_ARCHITECTURE.md) - 🔒 System architecture
- [Audit Report](audit-report.md) - Code audit findings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Security Contributions

If you find a security issue, please **DO NOT** open a public issue. Instead:
1. Email security concerns privately
2. Provide detailed reproduction steps
3. Wait for acknowledgment before public disclosure

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Security best practices from [OWASP](https://owasp.org/)
- Icons from [Lucide React](https://lucide.dev/)

---

Built with ❤️ and 🔒 security in mind

**Version**: 1.0.0  
**Last Updated**: January 2026
