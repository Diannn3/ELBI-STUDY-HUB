export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#7B1113',
          deep: '#5C1016',
          rich: '#9B111E',
        },
        forest: {
          DEFAULT: '#014421',
          light: '#186B3A',
        },
        gold: {
          DEFAULT: '#F5B335',
          pale: '#FBE6BE',
          deep: '#C98A1E',
        },
        cream: '#FFF9F1',
        sand: '#F2E8DC',
        sandDark: '#E3D5C3',
        charcoal: '#292725',
        muted: '#625B56',
        scene: {
          skyLight: '#A1C1E7',
          skyMid: '#7DB2E4',
          sky: '#55A3D9',
          foliage: '#304A37',
          grass: '#52772D',
          grassLight: '#8AAB44',
          wall: '#E5E1D8',
          roof: '#20818D',
        },
      },
      fontFamily: {
        pixel: ['Silkscreen', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
      },
      letterSpacing: {
        pixel: '0.06em',
        pixelwide: '0.14em',
      },
      boxShadow: {
        board: '0 2px 0 0 #5C1016, 0 10px 26px -8px rgba(41,39,37,0.45)',
        press: 'inset 0 2px 0 0 rgba(41,39,37,0.25)',
        raised: '0 2px 0 0 rgba(92,16,22,0.85)',
        dock: '0 -2px 0 0 #7B1113, 0 -12px 28px -14px rgba(41,39,37,0.5)',
      },
    },
  },
  plugins: [],
}
