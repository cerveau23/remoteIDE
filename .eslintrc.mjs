/** @type {import('eslint').Linter.Config} */
export default {
    env: {
        "browser": true,   // for DOM APIs if needed
        "es2021": true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        'plugin:jsdoc/recommended'
    ],
    overrides: [
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    plugins: [
        "@typescript-eslint",
        "jsdoc"
    ],
    ignorePatterns: [
        "node_modules/**",
        "build/**",
        "dist/**",
        "NetscriptDefinitions.d.ts"
    ],
    globals: {
        ns: 'readonly',           // BitBurner main namespace
        BitBurner: 'readonly',    // some scripts use this
    },
    rules: {
        // BitBurner-friendly minimal rules
        'no-console': 'off',           // console.log is fine
        'no-unused-vars': 'warn',      // warns but doesn’t block
        '@typescript-eslint/no-explicit-any': 'off', // some scripts require any
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // JSdoc linting
        'jsdoc/check-alignment': 'warn',
        'jsdoc/check-indentation': 'warn',
        'jsdoc/newline-after-description': 'off',  // optional
        'jsdoc/require-param': 'warn',
        'jsdoc/require-returns': 'warn',
        'jsdoc/require-param-type': 'off', // TS handles types
        'jsdoc/require-returns-type': 'off', // TS handles types
    },
};
