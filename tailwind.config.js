export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: "320px",
        tablet: "500px",
        laptop: "900px",
        desktop: "1400px",
      },
    },
  },
  plugins: [],
};
