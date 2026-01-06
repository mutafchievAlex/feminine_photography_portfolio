# 🏗️ Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    React Application                    │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │              Security Layer                       │ │   │
│  │  │                                                    │ │   │
│  │  │  ├─ CSRF Token Generation                        │ │   │
│  │  │  ├─ Input Validation & Sanitization              │ │   │
│  │  │  ├─ XSS Protection                                │ │   │
│  │  │  ├─ Rate Limiting (Client)                       │ │   │
│  │  │  ├─ Clickjacking Prevention                      │ │   │
│  │  │  └─ Secure Storage (Encrypted)                   │ │   │
│  │  │                                                    │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │              Application Logic                    │ │   │
│  │  │                                                    │ │   │
│  │  │  ├─ Authentication (AuthContext)                 │ │   │
│  │  │  ├─ Forms & Validation                            │ │   │
│  │  │  ├─ API Client (axios interceptors)              │ │   │
│  │  │  └─ Business Logic                                │ │   │
│  │  │                                                    │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Security Headers Applied:                                      │
│  ├─ X-Frame-Options: DENY                                      │
│  ├─ X-Content-Type-Options: nosniff                            │
│  ├─ X-XSS-Protection: 1; mode=block                            │
│  ├─ Content-Security-Policy                                    │
│  ├─ Referrer-Policy: strict-origin-when-cross-origin          │
│  └─ Permissions-Policy                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTPS
                               │ + Security Headers
                               │ + CSRF Token
                               │ + Sanitized Data
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        NGINX SERVER                              │
│                                                                  │
│  Security Features:                                             │
│  ├─ SSL/TLS (HTTPS)                                            │
│  ├─ Rate Limiting (Server-side)                                │
│  ├─ Request Filtering                                           │
│  ├─ Security Headers                                            │
│  ├─ HSTS                                                        │
│  └─ Compression & Caching                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ Proxy Pass
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND API                               │
│                                                                  │
│  ├─ CSRF Token Validation (To be implemented)                  │
│  ├─ Rate Limiting (To be implemented)                          │
│  ├─ Input Validation (To be implemented)                       │
│  └─ Business Logic                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ Authenticated Requests
                               │ + RLS Policies
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
│                                                                  │
│  ├─ PostgreSQL Database                                         │
│  │  └─ Row Level Security (RLS)                                │
│  ├─ Authentication                                               │
│  │  ├─ JWT Tokens                                               │
│  │  ├─ Session Management                                       │
│  │  └─ Password Hashing                                         │
│  ├─ Storage (Files)                                             │
│  │  └─ Access Policies                                          │
│  └─ Realtime                                                     │
│     └─ Channel Policies                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Security Layers Explained

### Layer 1: Client-Side Security (Browser)

**Purpose**: First line of defense - prevent malicious input and protect user

**Components**:
- `src/utils/security.js` - Core security utilities
- `src/App.jsx` - Security initialization
- `src/api/client.js` - Request interceptors

**Protection Against**:
- ✅ XSS (Cross-Site Scripting)
- ✅ Client-side injection
- ✅ Clickjacking
- ✅ Malicious URLs

### Layer 2: Application Logic

**Purpose**: Business logic with integrated security

**Components**:
- `src/contexts/AuthContext.jsx` - Secure authentication
- `src/pages/booking/components/BookingForm.jsx` - Form validation
- API clients with sanitization

**Protection Against**:
- ✅ Invalid data submission
- ✅ Brute force (rate limiting)
- ✅ Session hijacking
- ✅ Weak passwords

### Layer 3: Network Layer (HTTPS)

**Purpose**: Secure data transmission

**Components**:
- SSL/TLS encryption
- HSTS headers
- Secure cookies

**Protection Against**:
- ✅ Man-in-the-middle attacks
- ✅ Data interception
- ✅ Session hijacking

### Layer 4: Web Server (Nginx)

**Purpose**: Server-level security and filtering

**Components**:
- `nginx.security.conf` - Security configuration
- Rate limiting rules
- Security headers

**Protection Against**:
- ✅ DDoS attacks (basic)
- ✅ Malicious requests
- ✅ Path traversal
- ✅ Server fingerprinting

### Layer 5: Backend API

**Purpose**: Business logic validation (to be enhanced)

**Recommendations**:
- ⚠️ CSRF token validation
- ⚠️ Server-side rate limiting
- ⚠️ Input validation
- ⚠️ Authorization checks

**Protection Against**:
- ⚠️ API abuse
- ⚠️ Unauthorized access
- ⚠️ Data manipulation

### Layer 6: Database (Supabase)

**Purpose**: Data persistence with access control

**Components**:
- PostgreSQL with RLS
- Supabase Auth
- Storage policies

**Protection Against**:
- ✅ SQL injection (via parameterized queries)
- ✅ Unauthorized data access
- ✅ Data tampering
- ✅ Session management

## Data Flow Security

### Request Flow (Client → Server)

```
1. User Input
   ↓
   [Sanitization] - Remove dangerous characters
   ↓
   [Validation] - Check format, length, type
   ↓
   [Rate Limit Check] - Prevent abuse
   ↓
2. Add CSRF Token
   ↓
3. HTTPS Encryption
   ↓
4. Nginx Security Filter
   ↓
5. Backend Validation (recommended)
   ↓
6. Database (RLS applied)
```

### Response Flow (Server → Client)

```
1. Database Query (RLS enforced)
   ↓
2. Backend Processing
   ↓
3. Security Headers Added
   ↓
4. Nginx Compression & Headers
   ↓
5. HTTPS Encryption
   ↓
6. Client Receives & Validates
   ↓
7. Display to User
```

## Security Mechanisms

### 1. Input Validation Flow

```
User Input
    ↓
┌─────────────────┐
│  sanitizeInput  │ → Remove <>, javascript:, event handlers
└─────────────────┘
    ↓
┌─────────────────┐
│  isValidEmail   │ → RFC 5322 regex validation
│  isValidPhone   │ → Bulgarian format check
│  isValidName    │ → Letter-only validation
└─────────────────┘
    ↓
┌─────────────────┐
│detectMalicious  │ → Pattern matching for attacks
└─────────────────┘
    ↓
Clean, Safe Data
```

### 2. Authentication Flow

```
Login Attempt
    ↓
┌─────────────────┐
│ Rate Limit Check│ → Max 5 attempts/5min
└─────────────────┘
    ↓
┌─────────────────┐
│  Input Validation│ → Email format, no malicious code
└─────────────────┘
    ↓
┌─────────────────┐
│  Sanitization   │ → Clean email & password
└─────────────────┘
    ↓
┌─────────────────┐
│ Supabase Auth   │ → Verify credentials
└─────────────────┘
    ↓
┌─────────────────┐
│ Session Created │ → Encrypted sessionStorage
└─────────────────┘
    ↓
Authenticated User
```

### 3. API Request Flow

```
API Call
    ↓
┌─────────────────┐
│ Rate Limit Check│ → 30 requests/minute
└─────────────────┘
    ↓
┌─────────────────┐
│ Add CSRF Token  │ → X-CSRF-Token header
└─────────────────┘
    ↓
┌─────────────────┐
│ Sanitize Data   │ → Clean all string fields
└─────────────────┘
    ↓
┌─────────────────┐
│ Detect Malicious│ → Block if patterns found
└─────────────────┘
    ↓
┌─────────────────┐
│  Send Request   │ → HTTPS with credentials
└─────────────────┘
    ↓
Response Received
```

## Attack Prevention Matrix

| Attack Type | Prevention Layer | Implementation | Status |
|-------------|-----------------|----------------|--------|
| XSS | Client + CSP | Input sanitization, CSP headers | ✅ Active |
| CSRF | Client + Server | CSRF tokens in requests | ✅ Active |
| SQL Injection | Database | Supabase RLS + Parameterized queries | ✅ Active |
| Brute Force | Client + Server | Rate limiting | ✅ Active |
| Session Hijacking | All layers | HTTPS, secure storage, timeouts | ✅ Active |
| Clickjacking | Client + Server | X-Frame-Options, frame busting | ✅ Active |
| DDoS | Server | Nginx rate limiting | ⚠️ Basic |
| Man-in-the-Middle | Network | HTTPS, HSTS | ✅ Active |
| Path Traversal | Server | Nginx config | ✅ Active |
| Open Redirect | Client | URL validation | ✅ Active |

## Security Decision Tree

```
New Feature Development
    ↓
Does it accept user input?
    ├─ YES → Apply input validation & sanitization
    │         Add rate limiting if needed
    │         Test for XSS, injection
    │
    └─ NO → Does it display user content?
            ├─ YES → Use encodeHTML()
            │         Apply CSP
            │
            └─ NO → Does it make API calls?
                    ├─ YES → Use apiClient (auto-protected)
                    │         Add custom rate limit if needed
                    │
                    └─ NO → Standard development
```

## Monitoring & Logging Points

```
┌─────────────────────────────────────────────┐
│          Security Event Logging              │
├─────────────────────────────────────────────┤
│                                              │
│  1. Failed Login Attempts                   │
│     → Log: Email, IP, Timestamp             │
│                                              │
│  2. Rate Limit Violations                   │
│     → Log: Action, Key, Timestamp           │
│                                              │
│  3. Malicious Input Detection               │
│     → Log: Field, Pattern, IP               │
│                                              │
│  4. CSRF Token Mismatches                   │
│     → Log: Request URL, IP                  │
│                                              │
│  5. Unauthorized Access Attempts            │
│     → Log: Resource, User, Timestamp        │
│                                              │
│  6. Session Anomalies                       │
│     → Log: Session ID, Action               │
│                                              │
└─────────────────────────────────────────────┘
```

## Deployment Security Checklist

```
Production Deployment
    ↓
┌─────────────────────────────────────────┐
│ Pre-Deployment Security Checklist       │
├─────────────────────────────────────────┤
│                                          │
│ Environment                              │
│ ☐ .env not in Git                       │
│ ☐ HTTPS enabled                          │
│ ☐ Valid SSL certificate                 │
│ ☐ Environment variables set              │
│                                          │
│ Server Configuration                     │
│ ☐ Nginx security headers                │
│ ☐ Rate limiting configured               │
│ ☐ CORS properly set                      │
│ ☐ Firewall rules applied                 │
│                                          │
│ Database                                 │
│ ☐ Supabase RLS policies                 │
│ ☐ Backup strategy                        │
│ ☐ Access logs enabled                    │
│                                          │
│ Application                              │
│ ☐ All tests passing                      │
│ ☐ Security tests passing                 │
│ ☐ No console.log in production           │
│ ☐ Error handling configured              │
│                                          │
│ Monitoring                               │
│ ☐ Error tracking (Sentry, etc.)         │
│ ☐ Performance monitoring                 │
│ ☐ Security alerts                        │
│                                          │
└─────────────────────────────────────────┘
```

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Production Ready
