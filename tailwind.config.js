/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./routes/api/**/*.{ejs,html}", // Adaptez l'extension si vous utilisez autre chose (hbs, html...)
    "./public/**/*.html", // Si vous avez des fichiers HTML statiques
    "./src/**/*.{js,jsx,ts,tsx}", // Si vous utilisez des classes dans du JS (ex: Alpine.js)
  ],
  plugins: [],
  darkMode: 'class',
  theme: {
    colors: {
      bgDark: '#1C1C1C', //text-gray-200 
      txtDark: '#F8F9F9',
      PDark: '#2ECC71',
      SDark: '#58D68D',
      AccentDark: "#A3E4D7",
      bgClair: '#F8F9F9', //text-gray-200 
      txtClair: '#2C3E50',
      PClair: '#2ECC71',
      SClair: '#A3E4D7',
      AccentClair: "#1A7940",
    },
    extend: {
      colors: {
        primary: '#34D399',
        primaryDark: '#10B981',
        backgroundLight: '#F0FAF4',
        backgroundDark: '#052E16',
        accent: '#A7F3D0',
        textDark: '#1F2937',
        textLight: '#F0FDF4',
      },
      animation: {
        fade: 'fadeIn 0.5s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
}


