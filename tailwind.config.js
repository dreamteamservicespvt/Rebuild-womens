/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    'duration-[1500ms]'
  ],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // New gym theme colors
        "rebuild-purple": "#1a1a1a", // Changed to black
        "rebuild-pink": "#FFF318",   // Changed to bright yellow
        "gym": {
          yellow: "#FFF318",
          "yellow-glow": "#FFF31899",
          black: "#0A0A0A",
          gray: "#1A1A1A",
          "gray-light": "#2A2A2A",
          "gray-dark": "#0F0F0F",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
        // Add gym-themed fonts
        heading: ['"Bebas Neue"', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-yellow': '0 0 5px #FFF318, 0 0 20px #FFF318',
        'neon-yellow-lg': '0 0 10px #FFF318, 0 0 30px #FFF318, 0 0 50px #FFF318',
        'inner-yellow': 'inset 0 0 15px #FFF318',
        'button-hover': '0 0 15px #FFF318, 0 0 30px rgba(255, 243, 24, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        'pulse-yellow': {
          '0%, 100%': { boxShadow: '0 0 15px #FFF318, 0 0 30px rgba(255, 243, 24, 0.5)' },
          '50%': { boxShadow: '0 0 25px #FFF318, 0 0 40px rgba(255, 243, 24, 0.7)' },
        },
        'text-flicker': {
          '0%, 100%': { textShadow: '0 0 4px #FFF318, 0 0 11px #FFF318, 0 0 19px #FFF318' },
          '33%': { textShadow: '0 0 4px #FFF318, 0 0 10px #FFF318, 0 0 18px #FFF318' },
          '66%': { textShadow: '0 0 4px #FFF318, 0 0 12px #FFF318, 0 0 20px #FFF318' },
        },
        'heartbeat': {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        'flash-yellow': {
          '0%, 100%': { backgroundColor: 'rgba(255, 243, 24, 0)' },
          '50%': { backgroundColor: 'rgba(255, 243, 24, 0.3)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'pulse-yellow': 'pulse-yellow 2s infinite',
        'flicker': 'text-flicker 3s infinite alternate',
        'heartbeat': 'heartbeat 1.5s infinite',
        'flash-yellow': 'flash-yellow 2s infinite',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255, 243, 24, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 243, 24, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}