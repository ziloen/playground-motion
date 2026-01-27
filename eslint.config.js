import { react } from '@ziloen/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  react({ project: ['./tsconfig.json', './tsconfig.node.json'] }),
  { ignores: ['public'] },
)
