module.exports = {
    env: {
        commonjs: true,
        jest: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:jsdoc/recommended-typescript',
        'prettier',
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-returns-type': 'off',
        'jsdoc/tag-lines': [
            'warn',
            'any',
            {
                startLines: 1,
            },
        ],
    },
};
