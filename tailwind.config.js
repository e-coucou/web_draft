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
    extend: {
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


