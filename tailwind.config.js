/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* rose-100 with opacity */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* rose-100 */
        background: "var(--color-background)", /* white */
        foreground: "var(--color-foreground)", /* slate-800 */
        primary: {
          DEFAULT: "var(--color-primary)", /* stone-50 */
          foreground: "var(--color-primary-foreground)", /* slate-800 */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* orange-50 */
          foreground: "var(--color-secondary-foreground)", /* slate-800 */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* stone-50 */
          foreground: "var(--color-muted-foreground)", /* gray-500 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* rose-100 */
          foreground: "var(--color-accent-foreground)", /* slate-800 */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* slate-800 */
        },
        card: {
          DEFAULT: "var(--color-card)", /* stone-50 */
          foreground: "var(--color-card-foreground)", /* slate-800 */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
        // Brand-specific color aliases
        'gallery-canvas': "var(--color-primary)", /* stone-50 */
        'warm-section': "var(--color-secondary)", /* orange-50 */
        'feminine-accent': "var(--color-accent)", /* rose-100 */
        'surface-elevation': "var(--color-card)", /* stone-50 */
        'sophisticated-dark': "var(--color-foreground)", /* slate-800 */
        'hierarchy-secondary': "var(--color-muted-foreground)", /* gray-500 */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'elegant': ['Playfair Display', 'serif'],
        'sophisticated': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'elegant-xl': ['2.5rem', { lineHeight: '1.2', fontWeight: '400' }],
        'elegant-lg': ['2rem', { lineHeight: '1.3', fontWeight: '400' }],
        'elegant-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '400' }],
        'sophisticated-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '500' }],
        'sophisticated-md': ['1rem', { lineHeight: '1.6', fontWeight: '500' }],
      },
      spacing: {
        'golden-xs': '0.5rem', /* 8px */
        'golden-sm': '0.8125rem', /* 13px */
        'golden-md': '1.3125rem', /* 21px */
        'golden-lg': '2.125rem', /* 34px */
        'golden-xl': '3.4375rem', /* 55px */
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(239, 213, 213, 0.15)',
        'medium': '0 8px 32px rgba(239, 213, 213, 0.3)',
        'strong': '0 12px 48px rgba(239, 213, 213, 0.4)',
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'ken-burns': 'ken-burns 8s ease-in-out infinite alternate',
        'elegant-spin': 'elegant-spin 1s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        'gentle-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        'elegant-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        'elegant': '20px',
      },
      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'elegant': '300ms',
        'smooth': '400ms',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}