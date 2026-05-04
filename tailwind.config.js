const { transform } = require("framer-motion");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
		"./app/**/*.{js,jsx}",
		"./src/**/*.{js,jsx}",
	],
	theme: {
		screens: {
			sm: "375px",
			md: "768px",
			lg: "1200px",
		},
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				md: "2rem",
			},
		},
		extend: {
			colors: {
				"primary-orange": {
					50: "#fff3f1",
					100: "#ffe3df",
					200: "#ffccc5",
					300: "#ffa99d",
					400: "#ff7764",
					500: "#ff472e",
					600: "#ed2f15",
					700: "#c8230d",
					800: "#a5210f",
					900: "#882214",
					950: "#4b0c04",
				},
				"primary-blue": {
					50: "#eef8ff",
					100: "#d9efff",
					200: "#bce4ff",
					300: "#8ed4ff",
					400: "#59baff",
					500: "#3da0ff",
					600: "#1b7bf5",
					700: "#1465e1",
					800: "#1751b6",
					900: "#19468f",
					950: "#142c57",
				},
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
			},
			fontFamily: {
				montserrat: ["Montserrat Alternates", "sans-serif"],
				"sharp-grotesk": ["Sharp Grotesk", "sans-serif"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
		keyframes: {
			scroll: {
				to: {
					transform: "translate(calc(-50% - 0.5rem))",
				},
			},
			"scroll-2": {
				"0%": {
					transform: "translateX(0%)",
				},
				"100%": {
					transform: "translateX(-100%)",
				},
			},
		},
		animation: {
			scroll:
				"scroll var(--animation-duration, 30s) var(--animation-direction, forwards) linear infinite",
		},
	},
	plugins: [addVariablesForColors, require("tailwindcss-animate")],
};

// Updated function to add color variables
function addVariablesForColors({ addBase, theme }) {
	const colors = theme("colors");
	const newVars = {};

	const extractColorVars = (colorObj, prefix = "") => {
		Object.keys(colorObj).forEach((key) => {
			const value = colorObj[key];
			if (typeof value === "object") {
				extractColorVars(value, `${prefix}-${key}`);
			} else {
				newVars[`--${prefix}-${key}`] = value;
			}
		});
	};

	extractColorVars(colors, "color");
	addBase({ ":root": newVars });
}
