import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'
import * as espree from 'espree'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([
  {
    extends: fixupConfigRules(compat.extends('@react-native', 'prettier')),
    plugins: { prettier },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          singleQuote: true,
          bracketSpacing: true,
          endOfLine: 'lf',
          semi: false,
          tabWidth: 2,
          trailingComma: 'none'
        }
      ]
    }
  },
  {
    // @babel/eslint-parser 7.x (set by @react-native/eslint-config) is incompatible with ESLint 10
    files: ['**/*.js'],
    languageOptions: {
      parser: espree,
      parserOptions: { ecmaVersion: 'latest' }
    }
  },
  {
    ignores: ['node_modules/', 'lib/']
  }
])
