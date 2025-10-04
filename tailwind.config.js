export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#f59e0b",
          gold2: "#fbbf24"
        }
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
        montserrat: ["Montserrat", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        card: "0 10px 40px -10px rgba(0,0,0,.6)"
      },
      backgroundImage: {
        "grid-dots": "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)"
      },
      backgroundSize: {
        "grid-dots": "24px 24px"
      }
    }
  },
  plugins: []
}
