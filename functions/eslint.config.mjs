
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import {custom_config} from '../eslint_base.mjs'


export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    custom_config,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    }
)
