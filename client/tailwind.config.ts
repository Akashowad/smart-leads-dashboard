import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d9efff",
          500: "#0f91d2",
          600: "#0877b3",
          700: "#075f91"
        },
        ink: "#172033"
      },
      boxShadow: {
        panel: "0 16px 40px rgba(23, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
