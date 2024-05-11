/** @type { import('eslint').Linter.Config } */
module.exports = {
	root: true,
	rules: {
		'@typescript-eslint/array-type': [
			'error',
			{
				default: 'array-simple'
			}
		],
		'@typescript-eslint/consistent-generic-constructors': 'error',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_'
			}
		],
		'no-restricted-imports': [
			'error',
			{
				patterns: ['!*.css']
			}
		]
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
