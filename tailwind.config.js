// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: {
            600: "#2563eb", // blue-600
            700: "#1d4ed8", // blue-700
          },
          secondary: {
            600: "#6b7280", // gray-600
            700: "#4b5563", // gray-700
          },
        },
      },
    },
    plugins: [],
  };
  