module.exports = {
    settings: { react: { version: 'detect', }, },
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@next/next/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        cacheLifetime: { glob: 'Infinity', },
        ecmaFeatures: { jsx: true, },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint', 'unused-imports', '@stylistic'],
    ignorePatterns: [],
    rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
        '@stylistic/indent': ['error', 4],
        '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
        '@stylistic/no-multi-spaces': ['error', { "ignoreEOLComments": false }],
        '@stylistic/semi': ['error', 'never'],
        '@stylistic/eol-last': ['error', 'always'],
        '@stylistic/object-curly-spacing': ['error', 'always'],
        '@stylistic/object-curly-newline': ["error", { "multiline": true }],
        '@stylistic/space-before-blocks': ['error', 'always'],
        '@stylistic/space-infix-ops': ['error', { "int32Hint": false }],
        '@stylistic/space-unary-ops': [
            'error', {
                "words": true,
                "nonwords": true,
                "overrides": {
                    "new": true,
                    "++": true
                }
            }]
    },
}
