module.exports = {
    env: {
        browser: true,
        es6: true,
    },

    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },

    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended',
        'plugin:jsx-a11y/recommended',
        'prettier',
    ],

    plugins: ['react', 'import', 'jsx-a11y', 'prettier'],

    settings: {
        react: {
            version: 'detect',
        },
        // Tells eslint how to resolve imports
        'import/resolver': {
            node: {
                paths: ['src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },

    rules: {
        'react/prop-types': 0,
    },
}
