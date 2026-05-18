import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9"
        },
        ink: "#0f172a"
      },
      boxShadow: {
        panel: "0 20px 40px -15px rgba(124, 58, 237, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
