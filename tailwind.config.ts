import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      neutral: {
          white: "#ffffff",
          black: "#000000",
      },
      primary: {
          50: "#eaedee",
          100: "#d5dade",
          200: "#acb6bc",
          300: "#82919b",
          400: "#596d79",
          500: "#2f4858",
          600: "#263a46",
          700: "#1c2b35",
          800: "#131d23",
          900: "#090e12",
      },
      secondary: {
          50: "#fdfefd",
          100: "#fcfdfb",
          200: "#f9faf8",
          300: "#f5f8f4",
          400: "#f2f5f1",
          500: "#eff3ed",
          600: "#d7e2d1",
          700: "#bfd0b5",
          800: "#9eb093",
          900: "#697662",
      },
  },
  },
  plugins: [],
} satisfies Config;
