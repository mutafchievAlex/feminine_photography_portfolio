# Admin User Setup

## Admin Credentials

**Username/Email:** `admin95`  
**Password:** `admin95`

## Features

### Admin User Access:
1. **Album Management** - Add, edit, and organize photo albums (visible in header menu when logged in as admin)
2. **Admin Dashboard** - View statistics and manage the application (visible in header menu when logged in as admin)

### Regular Client Access:
- Home
- Gallery
- About
- Investment/Pricing
- Booking

## How to Test

1. Go to Sign In page (`/signin`)
2. Enter:
   - Email: `admin95`
   - Password: `admin95`
3. Click Sign In
4. You should see additional menu items:
   - **Album Management** (with LayoutGrid icon)
   - **Admin Dashboard** (with BarChart3 icon)
5. Click on these menu items to access admin-only pages

## Other Demo Accounts

### Admin Account 1
- **Email:** `elena@elenarosephotography.bg`
- **Password:** `elena2024`
- **Role:** Admin

### Regular Client
- **Email:** `maria.petrova@example.com`
- **Password:** `maria2024`
- **Role:** Client (no admin access)

## Registration

You can also create new accounts via the Sign Up page. All new accounts are created as regular clients. To make them admin accounts, they would need backend database changes.

## Implementation Details

- Admin menu items are conditionally rendered based on `user.user_metadata.role` or `profile.role`
- Admin pages (`/admin-dashboard` and `/album-management`) are protected by the `ProtectedRoute` component
- Non-admin users trying to access admin pages will be redirected to Sign In
- All authentication is currently mock-based (using localStorage) since dummy Supabase credentials are configured
