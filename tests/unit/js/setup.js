// Vitest setup file
import { beforeEach, vi } from 'vitest'

// Mock localStorage with proper implementation
const createLocalStorageMock = () => {
  let store = {}
  
  const mock = {
    getItem(key) {
      return store[key] || null
    },
    setItem(key, value) {
      store[key] = value.toString()
    },
    removeItem(key) {
      delete store[key]
    },
    clear() {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key(index) {
      const keys = Object.keys(store)
      return keys[index] || null
    },
    _getStore() {
      return store
    }
  }
  
  // Spy on methods for testing
  mock.getItem = vi.fn(mock.getItem)
  mock.setItem = vi.fn(mock.setItem)
  mock.removeItem = vi.fn(mock.removeItem)
  mock.clear = vi.fn(mock.clear)
  
  return mock
}

// Mock console methods to avoid noise in tests
const consoleMock = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
}

// Global setup for each test
beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks()
  
  // Setup DOM
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.fontSize = ''
  
  // Setup localStorage mock with fresh instance
  global.localStorage = createLocalStorageMock()
  
  // Setup console mock
  global.console = { ...console, ...consoleMock }
  
  // Setup window.matchMedia mock
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
  
  // Mock setTimeout/setInterval for consistency
  vi.useFakeTimers()
})

// Global teardown
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})