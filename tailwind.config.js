/** @type {import('tailwindcss').Config} */
module.exports = {
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
        border: "var(--color-border)", /* black/white with 10% opacity */
        input: "var(--color-input)", /* white/gray-700 */
        ring: "var(--color-ring)", /* blue-600 */
        background: "var(--color-background)", /* white/gray-800 */
        foreground: "var(--color-foreground)", /* gray-800/gray-50 */
        surface: "var(--color-surface)", /* gray-50/gray-700 */
        primary: {
          DEFAULT: "var(--color-primary)", /* blue-600 */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* gray-500 */
          foreground: "var(--color-secondary-foreground)", /* white/gray-50 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* blue-700 */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* white/gray-800 */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* gray-50/gray-600 */
          foreground: "var(--color-muted-foreground)", /* gray-500/gray-400 */
        },
        card: {
          DEFAULT: "var(--color-card)", /* white/gray-700 */
          foreground: "var(--color-card-foreground)", /* gray-800/gray-50 */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white/gray-700 */
          foreground: "var(--color-popover-foreground)", /* gray-800/gray-50 */
        },
        hover: {
          light: "var(--color-hover-light)", /* gray-100/gray-600 */
          medium: "var(--color-hover-medium)", /* gray-200/gray-500 */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
        system: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      boxShadow: {
        'subtle': 'var(--shadow-subtle)',
        'medium': 'var(--shadow-medium)',
        'strong': 'var(--shadow-strong)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '1': '1',
        '10': '10',
        '20': '20',
        '100': '100',
        '101': '101',
        '102': '102',
        '1000': '1000',
      },
      backdropBlur: {
        'subtle': '8px',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}