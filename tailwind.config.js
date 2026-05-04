/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-base)',
        panel: 'var(--surface)',
        panelStrong: 'var(--surface-strong)',
        ink: 'var(--text-main)',
        muted: 'var(--text-muted)',
        brand: 'var(--brand)',
        brandStrong: 'var(--brand-strong)',
        brandSoft: 'var(--brand-soft)',
        accent: 'var(--accent)',
        accentStrong: 'var(--accent-strong)',
        accentSoft: 'var(--accent-soft)',
        danger: 'var(--danger)',
        dangerSoft: 'var(--danger-soft)',
        success: 'var(--success)',
        successSoft: 'var(--success-soft)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
}

