# Hero Gallery Management

The hero section of your homepage is now fully dynamic and managed through the album management interface. No more hardcoded image links!

## 🎯 Quick Start

1. **Go to Admin Dashboard** → **Album Management**
2. Click **Create New Album** → Select **Hero Carousel** template
3. **Upload 4-6 images** and set display order
4. Done! Your homepage hero section updates automatically

## How It Works

The hero section automatically loads images from one of two sources:

### 1. **Primary: Hero Album** (Recommended)
The **Hero Carousel** template creates a special "Hero" album:
- Automatically published and displayed on homepage
- Only **one Hero album allowed** at a time
- Images shown in carousel rotation (5-second intervals)
- Images sorted by display order

### 2. **Fallback: Featured Images**
If no "Hero" album exists, the hero section will display up to 4 featured images from the gallery:
- Images marked as "featured" (is_featured = true)
- Useful as a fallback when no hero album is set up

## 📋 Setup Instructions

### Step 1: Create Hero Carousel Album
1. Go to **Admin Dashboard** → **Album Management**
2. Click **Create New Album**
3. Click **"Hero Carousel"** template (marked as "Special")
4. The title will automatically be set to **"Hero"**
5. The album will be **auto-published**

### Step 2: Upload Photos
1. In the album list, find the **Hero** album
2. Click it to edit
3. Click **Manage Photos** or **Upload Photos**
4. Upload 4-6 high-quality images
5. Set **display order** (0, 1, 2, etc.)
6. Optionally mark one as **featured**

### Step 3: Verify
- Navigate to your **homepage**
- The hero carousel should display your images
- Carousel auto-rotates every 5 seconds
- Navigation arrows and indicators work

## ✨ Features

### Hero Carousel Template
- 🎠 Automatic carousel rotation
- 📱 Responsive design (mobile, tablet, desktop)
- ⌨️ Keyboard navigation (arrow keys)
- 🎯 Click indicators to jump to specific image
- 🌐 Bilingual support (Bulgarian/English)
- ⚡ Auto-published (no manual publish needed)
- 🔒 Only one allowed (enforced by system)

### Image Management
- **Display Order**: Control carousel order (lower = first)
- **Alt Text**: SEO-friendly image descriptions
- **Featured Flag**: Optional - for fallback usage
- **Responsive Images**: Automatic thumbnail generation

## 🚫 Important Rules

- **Only one "Hero" album allowed** - Creating a new one requires deleting the old
- **Auto-Published** - Hero albums are always published (no need to toggle)
- **Title is Fixed** - Always named "Hero" for system recognition
- **Minimum 2 images** - Carousel needs at least 2 images to rotate

## 🔧 Technical Details

### Hook: `useHeroGallery`
Location: [src/hooks/useHeroGallery.js](src/hooks/useHeroGallery.js)

The hook handles:
- Fetching images from the "Hero" album (primary)
- Falling back to featured gallery images (secondary)
- Loading and error states
- Auto-refresh capability

**Usage:**
```jsx
const { images, loading, error, refetch } = useHeroGallery();
```

### Component: `HeroGallery`
Location: [src/pages/homepage/components/HeroGallery.jsx](src/pages/homepage/components/HeroGallery.jsx)

The component now:
- Uses the hook to fetch dynamic images
- Shows loading spinner while fetching
- Displays helpful message if no images are available
- Maintains all existing features (carousel, language toggle, etc.)
- Updates language preferences in localStorage

### Service: `albumService`
Key methods:
- `getTemplates()` - Returns available templates (now includes Hero Carousel)
- `getHeroAlbum()` - Fetches existing Hero album
- `createFromTemplate()` - Creates album from template with validation

## 📸 Image Requirements

- **Recommended dimensions**: 1920x1080 or wider (16:9 aspect ratio)
- **Format**: JPG, PNG (WebP supported)
- **File size**: Optimize for web (< 2MB per image)
- **Quality**: High resolution for printing industry standard (72+ DPI)
- **Quantity**: 4-6 images recommended for good rotation

## 🌐 Translation Support

The hero section maintains full language support:
- **Bulgarian (БГ)** and **English (EN)** supported
- Language toggle in top-right corner
- Preference saved to localStorage
- All UI text automatically translated

## ❌ Troubleshooting

### Images not loading?
1. Ensure the album is titled exactly **"Hero"** (case-sensitive)
2. Ensure the album is marked as **Published** (auto-done with template)
3. Check that photos have valid image URLs
4. Verify your Supabase database connection
5. Check browser console for errors (F12 → Console tab)

### "Hero Carousel already exists" message?
- Only one Hero album allowed
- Delete the existing Hero album first if you want to create a new one
- Or simply upload more photos to the existing Hero album

### Carousel not rotating?
- Ensure you have at least 2 images
- Check browser console for any errors (F12)
- Verify images are loading correctly (Network tab)
- Wait 5 seconds - carousel auto-rotates by default

### Images showing as broken/not found?
- Check image URLs in database
- Ensure images were uploaded successfully
- Try re-uploading the images
- Check file permissions and storage

## 🗄️ Database Schema

The system queries these existing tables:
- `albums` - Stores album metadata (title, description, etc.)
  - Special query: `title = 'Hero'` for hero album lookup
- `album_photos` - Links photos to albums
  - Uses `display_order` for carousel rotation order
- `gallery_images` - Stores actual image data
  - Falls back to `is_featured = true` if no Hero album exists

**No database schema changes** - Uses existing tables only.

## 📝 Template Details

### Hero Carousel Template
```
- ID: hero-carousel
- Session Type: hero
- Auto-Published: Yes
- Client Name Required: No
- Max Photos: Unlimited (recommend 4-6)
- Special Rules: Only one allowed, auto-published
```

### Other Templates (for reference)
- Classic Wedding
- Maternity Glow
- Family Moments
- Engagement Story
- Corporate Professional

