import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1320px",
      },
    },
    extend: {
      colors: {
        slate: {
          750: "#293649",
        },
      },
      borderColor: {
        main: "rgba(255, 255, 255, 0.24)",
      },
      backgroundImage: {
        glass:
          "linear-gradient(262.6deg, rgba(48, 49, 58, 0.5) 0%, rgba(48, 49, 58, 0.3) 101.18%, rgba(48, 49, 58, 0.3) 101.18%);",
        main: "url('/images/nba-logo-blue.svg')",
      },
      gridTemplateColumns: {
        "auto-fill": "repeat(auto-fill, minmax(320px, 1fr))",
      },
    },
  },
  plugins: [],
};
export default config;
