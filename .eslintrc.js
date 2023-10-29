export default {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    rules: {
        'prettier/prettier': 'warn',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/explicit-function-return-type': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/no-non-null-assertion': ['off'],
        '@typescript-eslint/interface-name-prefix': ['off'],
        '@typescript-eslint/ban-types': ['off'],
    },
}
