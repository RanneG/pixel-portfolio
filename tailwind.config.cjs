/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(240 10% 4%)",
        foreground: "hsl(180 100% 95%)",
        primary: "hsl(180 100% 50%)",
        secondary: "hsl(320 100% 60%)",
        accent: "hsl(120 100% 50%)",
        muted: "hsl(240 10% 15%)",
        card: "hsl(240 10% 8%)",
        pixelYellow: "hsl(50 100% 50%)",
        pixelOrange: "hsl(30 100% 55%)",
        pixelBlue: "hsl(220 100% 60%)"
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "system-ui", "sans-serif"],
        retro: ['"VT323"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        pixel: "0 0 0 4px hsl(240 10% 4%), 0 0 0 8px hsl(180 100% 50%)",
        "pixel-secondary":
          "0 0 0 4px hsl(240 10% 4%), 0 0 0 8px hsl(320 100% 60%)"
      },
      animation: {
        "crt-flicker": "crt-flicker 2.5s infinite",
        float: "float 6s ease-in-out infinite",
        "pixel-fade-in": "pixel-fade-in 0.9s ease-out both",
        "typewriter": "typewriter 4s steps(24, end) 1s 1 normal both",
        "blink-cursor": "blink-cursor 1s step-end infinite"
      }
    }
  },
  plugins: []
};



