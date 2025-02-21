import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
	// Your custom configs here
	{
		files: ["**/*.vue"],
		rules: {
			"vue/multi-word-component-names": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
		}
	}
)