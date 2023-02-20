import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    alias: { '@novel-tools': path.resolve(__dirname, 'packages') },
  },
})
