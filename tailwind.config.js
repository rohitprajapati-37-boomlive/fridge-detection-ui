/** @type {import('tailwindcss').Config} */

// IFN brand palette. The four values marked "brand" are the approved colours;
// every other step is a tint or shade derived from them, needed for hover,
// borders and disabled states. Change a brand value here and the whole site
// follows -- components should never hardcode a hex.
const flame = {
  50: "#fff4f1",
  100: "#ffe9e3",
  200: "#ffd0c4",
  300: "#ffab97",
  400: "#ff8a6f",
  500: "#ff6a4d", // brand
  600: "#f2573a",
  700: "#e04a2c",
  800: "#b83a22",
  900: "#8f2c1a",
  DEFAULT: "#ff6a4d",
};

const spice = {
  50: "#fbf1f1",
  100: "#f2dcdc",
  200: "#e3b8b8",
  300: "#cd8a8a",
  400: "#b04040",
  500: "#8f1a1a",
  600: "#7d1717",
  700: "#6d1414", // brand
  800: "#5a1010",
  900: "#4a0d0d",
  DEFAULT: "#6d1414",
};

const cream = {
  50: "#fffdf7",
  100: "#fcf9ec", // brand
  200: "#f5efd9",
  300: "#eae2c9",
  400: "#ddd2b0",
  DEFAULT: "#fcf9ec",
};

const butter = {
  50: "#fffdf0",
  100: "#fff8cf", // brand
  200: "#f9eeb6",
  300: "#e8d98d",
  400: "#d6c56f",
  DEFAULT: "#fff8cf",
};

// Warm neutrals pulled toward spice so nothing on the page reads as cold grey.
const ink = {
  DEFAULT: "#2b1512",
  muted: "#7a6058",
  soft: "#8a6f68",
  line: "#eae2c9",
};

// ---------------------------------------------------------------------------
// Brand enforcement. Tailwind's stock colour families are re-pointed at the
// palette above, so an existing class like `bg-red-600` or `text-gray-500`
// renders on-brand without touching 290 call sites. Nothing off-palette can
// reach the page: writing `bg-blue-500` also lands on spice.
// Levels 500+ are kept dark enough for white text -- see the contrast audit.
// ---------------------------------------------------------------------------
const warmGray = {
  50: "#fffdf7", 100: "#f7f2e4", 200: "#eae2c9", 300: "#ddd2b0", 400: "#b9a49c",
  500: "#8a6f68", 600: "#7a6058", 700: "#5c453f", 800: "#3d2823", 900: "#2b1512",
  950: "#1c0d0b",
};

// Deep maroon. Used wherever a solid fill carries white text.
const spiceRamp = {
  50: "#fbf1f1", 100: "#f2dcdc", 200: "#e3b8b8", 300: "#cd8a8a", 400: "#b04040",
  500: "#8f1a1a", 600: "#6d1414", 700: "#5a1010", 800: "#4a0d0d", 900: "#3a0a0a",
  950: "#2a0707",
};

// Brand flame at 500, for accents, rings and highlights.
const flameAccent = {
  50: "#fff4f1", 100: "#ffe9e3", 200: "#ffd0c4", 300: "#ffab97", 400: "#ff8a6f",
  500: "#ff6a4d", 600: "#e04a2c", 700: "#b83a22", 800: "#8f2c1a", 900: "#7a2515",
  950: "#5e1c10",
};

// Darker flame, for the families that get used as solid buttons.
const flameDeep = {
  50: "#fff4f1", 100: "#ffe9e3", 200: "#ffd0c4", 300: "#ffab97", 400: "#ff8a6f",
  500: "#f2573a", 600: "#b83a22", 700: "#8f2c1a", 800: "#7a2515", 900: "#5e1c10",
  950: "#431309",
};

// Butter is a light-only colour, so 500+ falls through to flame and spice.
const butterRamp = {
  50: "#fffdf0", 100: "#fff8cf", 200: "#f9eeb6", 300: "#e8d98d", 400: "#d6c56f",
  500: "#b83a22", 600: "#8f2c1a", 700: "#6d1414", 800: "#5a1010", 900: "#4a0d0d",
  950: "#3a0a0a",
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        flame, spice, cream, butter, ink,

        white: "#fffdf7",

        gray: warmGray, slate: warmGray, zinc: warmGray,
        neutral: warmGray, stone: warmGray,

        red: spiceRamp, purple: spiceRamp, indigo: spiceRamp,
        blue: spiceRamp, violet: spiceRamp, fuchsia: spiceRamp,

        orange: flameAccent, pink: flameAccent, rose: flameAccent,

        green: flameDeep, emerald: flameDeep, teal: flameDeep,
        lime: flameDeep, cyan: flameDeep, sky: flameDeep,

        yellow: butterRamp, amber: butterRamp,
      },
      fontFamily: {
        sans: [
          "Figtree",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
