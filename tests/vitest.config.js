/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.js'],
    exclude: [
      'tests/e2e/**',
      'tests/accessibility/**', 
      '_site/**',
      'node_modules/**'
    ],
    coverage: {
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './test-reports/unified/embedded/coverage-js',
      include: ['src/assets/js/**/*.js'],
      exclude: ['tests/**', 'node_modules/**']
    },
    setupFiles: ['./tests/unit/js/setup.js']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src/assets/js'),
      '@tests': resolve(__dirname, '../tests')
    }
  }
})