/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				theme: {
					blue: "#2B2A4C",
					red: "#B31312",
					peach: "#EA906C",
					grey: "#EEE2DE",
				},
			},
		},
	},
	plugins: [],
};
