// Theme Manager Tests
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeManager } from '@/theme-manager.js'

describe('ThemeManager', () => {
  let themeManager
  let mockToggleButton

  beforeEach(() => {
    // Setup DOM
    mockToggleButton = document.createElement('button')
    mockToggleButton.id = 'theme-toggle'
    document.body.appendChild(mockToggleButton)
    
    // Clear localStorage mock
    localStorage.clear()
    
    // Create theme manager instance
    themeManager = new ThemeManager()
  })

  describe('initialization', () => {
    it('should initialize with default dark theme', () => {
      expect(themeManager.getCurrentTheme()).toBe('dark')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should load theme from localStorage', () => {
      localStorage.setItem('theme', 'light')
      const newManager = new ThemeManager()
      
      expect(newManager.getCurrentTheme()).toBe('light')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    it('should update toggle button text on init', () => {
      expect(mockToggleButton.textContent).toBe('☀️') // dark theme shows sun
    })
  })

  describe('theme switching', () => {
    it('should toggle from dark to light', () => {
      const result = themeManager.toggleTheme()
      
      expect(result).toBe('light')
      expect(themeManager.getCurrentTheme()).toBe('light')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
      expect(mockToggleButton.textContent).toBe('🌙') // light theme shows moon
    })

    it('should toggle from light to dark', () => {
      themeManager.applyTheme('light')
      const result = themeManager.toggleTheme()
      
      expect(result).toBe('dark')
      expect(themeManager.getCurrentTheme()).toBe('dark')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      expect(mockToggleButton.textContent).toBe('☀️')
    })

    it('should save theme to localStorage', () => {
      themeManager.toggleTheme()
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')
    })
  })

  describe('apply theme', () => {
    it('should apply dark theme correctly', () => {
      themeManager.applyTheme('dark')
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      expect(themeManager.getCurrentTheme()).toBe('dark')
    })

    it('should apply light theme correctly', () => {
      themeManager.applyTheme('light')
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
      expect(themeManager.getCurrentTheme()).toBe('light')
    })
  })

  describe('button interaction', () => {
    it('should respond to button clicks', () => {
      const initialTheme = themeManager.getCurrentTheme()
      
      mockToggleButton.click()
      
      expect(themeManager.getCurrentTheme()).not.toBe(initialTheme)
    })

    it('should handle missing toggle button gracefully', () => {
      mockToggleButton.remove()
      const managerWithoutButton = new ThemeManager()
      
      // Should not throw error
      expect(() => managerWithoutButton.toggleTheme()).not.toThrow()
    })
  })

  describe('static factory method', () => {
    it('should create new instance via static method', () => {
      const staticManager = ThemeManager.create()
      
      expect(staticManager).toBeInstanceOf(ThemeManager)
      expect(staticManager.getCurrentTheme()).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('should handle invalid themes', () => {
      themeManager.applyTheme('invalid-theme')
      
      expect(themeManager.getCurrentTheme()).toBe('invalid-theme')
      expect(document.documentElement.getAttribute('data-theme')).toBe('invalid-theme')
    })

    it('should handle empty localStorage values', () => {
      localStorage.setItem('theme', '')
      const newManager = new ThemeManager()
      
      expect(newManager.getCurrentTheme()).toBe('dark') // should fallback to dark
    })
  })
})