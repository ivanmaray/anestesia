module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nasa: {
          50: '#f5f8ff',
          100: '#e6f0ff',
          200: '#bfdcff',
          300: '#99c7ff',
          400: '#4d9eff',
          500: '#1565d8',
          600: '#0f4ab0',
          700: '#0b357f',
          800: '#082650',
          900: '#041327'
        },
        accent: {
          500: '#FF3B30'
        },
        nebula: {
          50: '#f8fafc',
          100: '#eef2ff'
        }
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(ellipse at 10% 10%, rgba(37,99,235,0.12), transparent 10%), radial-gradient(ellipse at 90% 90%, rgba(15,72,176,0.12), transparent 15%), linear-gradient(180deg,#021026 0%, #041027 50%, #001026 100%)'
      }
    }
  },
  plugins: []
}
