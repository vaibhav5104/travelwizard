/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit', // Enable Just-In-Time mode for better performance
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"], // Define where Tailwind should scan for classes
    theme: {
      extend: {
        animation: {
          blob: "blob 10s infinite",
          float: "float 3s infinite",
          borderFlow: "borderFlow 2s forwards",
          fadeIn: "fadeIn 1s forwards",
          slideUp: "slideUp 1s forwards"
        },
        keyframes: {
          blob: {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "25%": { transform: "translate(20px, -30px) scale(1.1)" },
            "50%": { transform: "translate(0, 50px) scale(1)" },
            "75%": { transform: "translate(-30px, -25px) scale(0.9)" },
          },
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          borderFlow: {
            "0%": { transform: "scaleX(0)", opacity: "0" },
            "10%": { opacity: "1" },
            "100%": { transform: "scaleX(1)", opacity: "1" },
          },
          fadeIn: {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          slideUp: {
            "0%": { transform: "translateY(20px)", opacity: "0" },
            "100%": { transform: "translateY(0)", opacity: "1" },
          },
        },
      },
    },
    plugins: [],
  };
  