import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint, { Config } from 'typescript-eslint'

export default [
  { files: ['src/**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['dist/', '.tsimp/'] },
  { languageOptions: { globals: globals.browser } },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
] satisfies Config
