/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "../node_modules/@clarion-app/contacts-frontend/src/**/*.{js,ts,jsx,tsx}",
  "../node_modules/@clarion-app/gtd-frontend/src/**/*.{js,ts,jsx,tsx}",
  "../node_modules/@clarion-app/life-log-frontend/src/**/*.{js,ts,jsx,tsx}",
  "../node_modules/@clarion-app/lists-frontend/src/**/*.{js,ts,jsx,tsx}",
  "../node_modules/@clarion-app/llm-client-frontend/src/**/*.{js,ts,jsx,tsx}",
  "../node_modules/@clarion-app/wizlight-frontend/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

