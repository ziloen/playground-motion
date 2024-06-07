import { defineConfig, preset } from "@ziloen/tailwind-config"

export default defineConfig({
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: ['variant', [`[data-theme="dark"] &`, `:host([data-theme="dark"]) &`],],
  presets: [preset],
})