import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14131a",
        paper: "#f5f0e8",
        blood: "#7f1d1d",
        mist: "#d8d0c4"
      }
    },
  },
  plugins: [],
};

export default config;
