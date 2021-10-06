module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
        'prettier',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
        'dot-notation': 'warn',
        'no-unreachable': 'warn',
        '@typescript-eslint/no-namespace': 'off',
    },
};
