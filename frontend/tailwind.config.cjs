module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#930500',
          secondary: '#95bbea',
          surface: '#FFF8E7',
          ink: '#35180c'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      boxShadow: {
        glass: '0 20px 60px rgba(90, 38, 12, 0.18)'
      },
      backgroundImage: {
        'survey-gradient': 'linear-gradient(135deg, rgba(255,248,231,0.96) 0%, rgba(255,239,212,0.94) 48%, rgba(240,248,255,0.96) 100%)'
      }
    }
  },
  plugins: []
};
