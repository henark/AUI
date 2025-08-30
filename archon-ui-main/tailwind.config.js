module.exports = {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: "selector",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "shimmer": "shimmer 2s infinite",
      },
      boxShadow: {
        'neon-purple': '0 0 10px 2px rgba(168, 85, 247, 0.4), 0 0 20px 5px rgba(168, 85, 247, 0.7)',
        'neon-green': '0 0 10px 2px rgba(16, 185, 129, 0.4), 0 0 20px 5px rgba(16, 185, 129, 0.7)',
        'neon-pink': '0 0 10px 2px rgba(236, 72, 153, 0.4), 0 0 20px 5px rgba(236, 72, 153, 0.7)',
        'neon-blue': '0 0 10px 2px rgba(59, 130, 246, 0.4), 0 0 20px 5px rgba(59, 130, 246, 0.7)',
        'neon-cyan': '0 0 10px 2px rgba(34, 211, 238, 0.4), 0 0 20px 5px rgba(34, 211, 238, 0.7)',
        'neon-orange': '0 0 10px 2px rgba(249, 115, 22, 0.4), 0 0 20px 5px rgba(249, 115, 22, 0.7)',
        'glow-purple': '0 0 20px 5px rgba(168, 85, 247, 0.6)',
        'glow-green': '0 0 20px 5px rgba(16, 185, 129, 0.6)',
        'glow-pink': '0 0 20px 5px rgba(236, 72, 153, 0.6)',
        'glow-blue': '0 0 20px 5px rgba(59, 130, 246, 0.6)',
        'glow-cyan': '0 0 20px 5px rgba(34, 211, 238, 0.6)',
        'glow-orange': '0 0 20px 5px rgba(249, 115, 22, 0.6)',
      },
      backgroundImage: {
        'radial-glow-purple': 'radial-gradient(circle, rgba(168, 85, 247, 0.9) 0%, transparent 70%)',
        'radial-glow-green': 'radial-gradient(circle, rgba(16, 185, 129, 0.9) 0%, transparent 70%)',
        'radial-glow-pink': 'radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, transparent 70%)',
        'radial-glow-blue': 'radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, transparent 70%)',
        'radial-glow-cyan': 'radial-gradient(circle, rgba(34, 211, 238, 0.9) 0%, transparent 70%)',
        'radial-glow-orange': 'radial-gradient(circle, rgba(249, 115, 22, 0.9) 0%, transparent 70%)',
      },
      dropShadow: {
        'glow-purple': '0 0 15px rgba(168, 85, 247, 0.8)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.8)',
        'glow-pink': '0 0 15px rgba(236, 72, 153, 0.8)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.8)',
        'glow-cyan': '0 0 15px rgba(34, 211, 238, 0.8)',
        'glow-orange': '0 0 15px rgba(249, 115, 22, 0.8)',
      }
    },
  },
}