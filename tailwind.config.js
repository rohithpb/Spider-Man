/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border, 217 33% 17%))",
        input: "hsl(var(--input, 217 33% 17%))",
        ring: "hsl(var(--ring, 0 84% 60%))",
        background: "hsl(var(--background, 222 47% 5%))",
        foreground: "hsl(var(--foreground, 210 40% 98%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 354 78% 54%))",
          foreground: "hsl(var(--primary-foreground, 210 40% 98%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 215 25% 15%))",
          foreground: "hsl(var(--secondary-foreground, 210 40% 98%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%))",
          foreground: "hsl(var(--destructive-foreground, 210 40% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 217 33% 14%))",
          foreground: "hsl(var(--muted-foreground, 215 20% 65%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 199 89% 48%))",
          foreground: "hsl(var(--accent-foreground, 210 40% 98%))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 222 47% 7%))",
          foreground: "hsl(var(--popover-foreground, 210 40% 98%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 222 47% 8%))",
          foreground: "hsl(var(--card-foreground, 210 40% 98%))",
        },
        spidey: {
          red: "#E23636",
          crimson: "#DC2626",
          darkred: "#991B1B",
          blue: "#0284C7",
          navy: "#0B407D",
          deepnavy: "#050B1A",
          gold: "#F59E0B",
          web: "#38BDF8",
          dark: "#050811",
          card: "#0A1020",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.75rem)",
        md: "calc(var(--radius, 0.75rem) - 2px)",
        sm: "calc(var(--radius, 0.75rem) - 4px)",
      },
      boxShadow: {
        'spider-glow': '0 0 25px -5px rgba(226, 54, 54, 0.4), 0 0 10px -2px rgba(2, 132, 199, 0.3)',
        'web-glow': '0 0 20px -3px rgba(56, 189, 248, 0.4)',
        'spidey-neon': '0 0 15px rgba(226, 54, 54, 0.6), inset 0 0 15px rgba(226, 54, 54, 0.2)',
      },
      keyframes: {
        'spider-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'spider-sense': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2)' },
        },
        'web-shoot': {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        'spider-pulse': 'spider-pulse 2.5s ease-in-out infinite',
        'spider-sense': 'spider-sense 1.8s ease-in-out infinite',
        'web-shoot': 'web-shoot 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
