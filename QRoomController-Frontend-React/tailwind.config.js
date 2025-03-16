export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azure: "#f0ffff",
      },
    },
  },
  plugins: [import("flowbite/plugin")], // Use import() for ESM
};
