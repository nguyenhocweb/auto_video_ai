import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9ddfd",
          300: "#7cc1fc",
          400: "#36a2f8",
          500: "#0c87eb",
          600: "#006ac9",
          700: "#0154a3",
          800: "#054786",
          900: "#0a3c6f",
          950: "#07264a",
        },
      },
    },
  },
  plugins: [],
};

export default config;

