
export const custom_config = {
    rules: {

        // Enable as errors
        'no-promise-executor-return': 'error',
        'no-template-curly-in-string': 'error',
        'no-unreachable-loop': 'error',
        'no-constructor-return': 'error',
        'eqeqeq': 'error',
        'no-eval': 'error',

        // Enable as warnings
        'max-len': ['warn', {code: 100, ignoreUrls: true, ignoreTemplateLiterals: true}],
        'indent': ['warn', 4, {
            SwitchCase: 1,
            FunctionDeclaration: {parameters: 2},
            FunctionExpression: {parameters: 2},
            // eslint doesn't handle class methods well yet, so ignore identing of their params
            ignoredNodes: ['MethodDefinition Identifier'],
        }],
        'comma-dangle': ['warn', 'always-multiline'],
        'semi': ['warn', 'never', {beforeStatementContinuationChars: 'always'}],
        'no-console': ['warn', {allow: ['warn', 'error', 'info', 'debug']}],  // Non-log allowed
        'space-before-blocks': ['warn', 'never'],

        // Disable as are not problems at all
        '@typescript-eslint/no-extra-semi': 'off',  // Conflicts with 'semi' rule
        '@typescript-eslint/no-empty-interface': 'off',  // Empty interfaces may be expanded later
        '@typescript-eslint/no-non-null-assertion': 'off',  // trailing ! can be useful
        '@typescript-eslint/require-await': 'off',  // Some fns async to match spec or await later
        '@typescript-eslint/no-empty-function': 'off',  // Empty fns may be used to match a spec
        '@typescript-eslint/explicit-module-boundary-types': 'off',  // TS auto detect saves time

        // Disable as already covered by other audits (such as tsc)
        'import/no-unresolved': 'off',  // Vite imports complex and already handled by tsc

        // Default to error but should be warnings
        'no-empty': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',

        // Need customisation
        'no-constant-condition': ['error', {checkLoops: false}],  // while (true) useful at times
        'prefer-const': ['warn', {destructuring: 'all'}],  // Allows `let [a, b]` if only `a` const
        '@typescript-eslint/no-unused-vars': ['warn', {args: 'none'}],  // Unused args (eg event) ok
        '@typescript-eslint/no-misused-promises': ['error', {checksVoidReturn: false}],
            // Trying to refactor async fns to please checksVoidReturn is more trouble than worth
        '@typescript-eslint/ban-ts-comment': ['error', {'ts-ignore': 'allow-with-description'}],
            // There are some issues (such as Vue 2/3 compatibility) that can't be solved otherwise
    },
}


export const custom_config_vue = {
    rules: {
        // Disable as are not problems at all
        'vue/max-attributes-per-line': 'off',  // Allow attributes split across e.g. 2 lines
        'vue/first-attribute-linebreak': 'off',  // Do whatever looks nicest instead
        'vue/attributes-order': 'off',  // Too opinionated
        'vue/html-quotes': 'off',  // Single quotes for vars and double for strings
        'vue/no-v-html': 'off',  // Legit uses for injecting HTML, especially own HTML

        // Need customisation
        'vue/prop-name-casing': ['warn', 'snake_case'],  // Not camel case
    },
}
