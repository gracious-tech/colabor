
import {fileURLToPath} from 'node:url'
import {dirname} from 'node:path'

import eslint from '@eslint/js'
import {FlatCompat} from '@eslint/eslintrc'
import eslint_ts from 'typescript-eslint'
import eslint_vue from 'eslint-plugin-vue'

import {custom_config, custom_config_vue} from '../eslint_base.mjs'


// Converter needed for pug plugin which uses old config format
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat({baseDirectory: __dirname})
const pug_configs = compat.extends('plugin:vue-pug/vue3-recommended')

export default eslint_ts.config(
    eslint.configs.recommended,
    eslint_ts.configs.recommendedTypeChecked,
    eslint_vue.configs['flat/recommended'],
    ...pug_configs,
    custom_config,
    custom_config_vue,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                extraFileExtensions: ['.vue'],
                parser: eslint_ts.parser,
            },
        },
    }
)
