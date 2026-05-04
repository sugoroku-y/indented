// @ts-check

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
    recommendedConfig: require('@eslint/js').configs.recommended,
    allConfig: require('@eslint/js').configs.all,
});

module.exports = [
    {
        ignores: ['coverage/**', 'lib/**'],
    },
    ...compat.extends(
        'eslint:recommended',
        'plugin:jsdoc/recommended-typescript-error',
        'plugin:eslint-comments/recommended',
        'plugin:import/typescript',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'prettier',
    ),
    ...compat.env({
        'jest/globals': true,
        es2021: true,
        node: true,
    }),
    ...compat.config({
        overrides: [
            {
                files: ['**/*.ts'],
                extends: [
                    'plugin:@typescript-eslint/recommended-requiring-type-checking',
                ],
            },
        ],
    }),
    {
        plugins: {
            jsdoc: require('eslint-plugin-jsdoc'),
            'eslint-comments': require('eslint-plugin-eslint-comments'),
            import: require('eslint-plugin-import'),
            jest: require('eslint-plugin-jest'),
            'unused-imports': require('eslint-plugin-unused-imports'),
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'commonjs',
            },
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.ts'],
                },
                typescript: {
                    project: './',
                },
            },
        },
        rules: {
            'jest/consistent-test-it': [
                'error',
                {
                    fn: 'test',
                },
            ],
            'jest/require-top-level-describe': ['error'],
            'jsdoc/require-jsdoc': [
                'error',
                {
                    publicOnly: true,
                    contexts: ['TSTypeAliasDeclaration'],
                },
            ],
            'jsdoc/require-description': [
                'error',
                {
                    contexts: ['FunctionDeclaration', 'TSTypeAliasDeclaration'],
                },
            ],
            'jsdoc/check-tag-names': [
                'error',
                {
                    definedTags: ['hidden', 'typeParam', 'remark'],
                },
            ],
            'eslint-comments/no-use': [
                'error',
                {
                    allow: [
                        'eslint-enable',
                        'eslint-disable',
                        'eslint-disable-line',
                        'eslint-disable-next-line',
                    ],
                },
            ],
            'eslint-comments/no-unused-disable': 'error',
            'eslint-comments/require-description': 'error',
            'no-param-reassign': 'error',
            'no-console': 'off',
            'no-void': [
                'error',
                {
                    allowAsStatement: true,
                },
            ],
            'import/no-anonymous-default-export': [
                'error',
                {
                    allowObject: true,
                },
            ],
            'import/extensions': ['error', 'never'],
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: ['**/tests/**'],
                    optionalDependencies: false,
                },
            ],
            'import/order': ['error'],
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: [
                    'tsconfig.json',
                    'tests/tsconfig.json',
                    'tsconfig-eslint.json',
                ],
            },
        },
        rules: {
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-floating-promises': [
                'error',
                {
                    ignoreIIFE: true,
                },
            ],
            '@typescript-eslint/require-await': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        files: ['**/tests/**'],
        rules: {
            'jsdoc/require-jsdoc': 'off',
            'import/no-extraneous-dependencies': 'off',
        },
    },
    {
        files: ['**/*.cjs'],
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            'import/extensions': [
                'error',
                {
                    json: 'always',
                },
            ],
            'import/order': 'off',
            'jsdoc/no-types': 'off',
        },
    },
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-extraneous-dependencies': 'off',
        },
    },
];
