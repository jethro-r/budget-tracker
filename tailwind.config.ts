import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "rgb(var(--bg-primary))",
          secondary: "rgb(var(--bg-secondary))",
          tertiary: "rgb(var(--bg-tertiary))",
        },
        accent: {
          primary: "rgb(var(--accent-primary))",
          secondary: "rgb(var(--accent-secondary))",
          success: "rgb(var(--accent-success))",
          danger: "rgb(var(--accent-danger))",
          warning: "rgb(var(--accent-warning))",
        },
        text: {
          primary: "rgb(var(--text-primary))",
          secondary: "rgb(var(--text-secondary))",
          muted: "rgb(var(--text-muted))",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(var(--glow), var(--glow-opacity))",
        "glow-lg": "0 0 40px rgba(var(--glow), 0.5)",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
