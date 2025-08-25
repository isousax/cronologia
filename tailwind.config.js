/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        love: {
          primary: "#e84393",
          secondary: "#fd79a8",
          accent: "#6c5ce7",
          dark: "#2d3436",
          light: "#dfe6e9",
        },
      },
      fontFamily: {
        display: ["Dancing Script", "cursive"],
        heading: ["Playfair Display", "serif"],
        body: ["Poppins", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "15%": { transform: "scale(1.1)" },
          "30%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.1)" },
          "60%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
