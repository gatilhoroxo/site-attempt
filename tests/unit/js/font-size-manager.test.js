// Font Size Manager Tests
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FontSizeManager } from '@/font-size-manager.js'

describe('FontSizeManager', () => {
  let fontSizeManager
  let mockDecreaseButton
  let mockIncreaseButton

  beforeEach(() => {
    // Setup DOM
    mockDecreaseButton = document.createElement('button')
    mockDecreaseButton.id = 'font-decrease'
    mockIncreaseButton = document.createElement('button')
    mockIncreaseButton.id = 'font-increase'
    
    document.body.appendChild(mockDecreaseButton)
    document.body.appendChild(mockIncreaseButton)
    
    // Clear localStorage mock
    localStorage.clear()
    
    // Reset document styles
    document.documentElement.style.fontSize = ''
    
    // Create font size manager instance
    fontSizeManager = new FontSizeManager()
  })

  describe('initialization', () => {
    it('should initialize with default font size (100%)', () => {
      expect(fontSizeManager.getCurrentFontSize()).toBe(100)
      expect(fontSizeManager.getCurrentIndex()).toBe(2)
      expect(document.documentElement.style.fontSize).toBe('100%')
    })

    it('should load saved font size index from localStorage', () => {
      localStorage.setItem('fontSizeIndex', '3')
      const newManager = new FontSizeManager()
      
      expect(newManager.getCurrentFontSize()).toBe(112.5)
      expect(newManager.getCurrentIndex()).toBe(3)
    })

    it('should update button states on init', () => {
      // At default index (2), neither button should be disabled
      expect(mockDecreaseButton.disabled).toBe(false)
      expect(mockIncreaseButton.disabled).toBe(false)
    })
  })

  describe('font size increase', () => {
    it('should increase font size', () => {
      const result = fontSizeManager.increaseFontSize()
      
      expect(result).toBe(112.5)
      expect(fontSizeManager.getCurrentIndex()).toBe(3)
      expect(document.documentElement.style.fontSize).toBe('112.5%')
    })

    it('should not increase beyond maximum', () => {
      // Set to maximum (index 4)
      fontSizeManager.setFontSizeIndex(4)
      const result = fontSizeManager.increaseFontSize()
      
      expect(result).toBeNull()
      expect(fontSizeManager.getCurrentIndex()).toBe(4)
      expect(mockIncreaseButton.disabled).toBe(true)
    })

    it('should save index to localStorage', () => {
      fontSizeManager.increaseFontSize()
      
      expect(localStorage.setItem).toHaveBeenCalledWith('fontSizeIndex', '3')
    })
  })

  describe('font size decrease', () => {
    it('should decrease font size', () => {
      const result = fontSizeManager.decreaseFontSize()
      
      expect(result).toBe(93.75)
      expect(fontSizeManager.getCurrentIndex()).toBe(1)
      expect(document.documentElement.style.fontSize).toBe('93.75%')
    })

    it('should not decrease beyond minimum', () => {
      // Set to minimum (index 0)
      fontSizeManager.setFontSizeIndex(0)
      const result = fontSizeManager.decreaseFontSize()
      
      expect(result).toBeNull()
      expect(fontSizeManager.getCurrentIndex()).toBe(0)
      expect(mockDecreaseButton.disabled).toBe(true)
    })
  })

  describe('button interaction', () => {
    it('should respond to increase button clicks', () => {
      const initialSize = fontSizeManager.getCurrentFontSize()
      
      mockIncreaseButton.click()
      
      expect(fontSizeManager.getCurrentFontSize()).toBeGreaterThan(initialSize)
    })

    it('should respond to decrease button clicks', () => {
      const initialSize = fontSizeManager.getCurrentFontSize()
      
      mockDecreaseButton.click()
      
      expect(fontSizeManager.getCurrentFontSize()).toBeLessThan(initialSize)
    })
  })

  describe('font size setting', () => {
    it('should set font size by index', () => {
      const result = fontSizeManager.setFontSizeIndex(4)
      
      expect(result).toBe(true)
      expect(fontSizeManager.getCurrentFontSize()).toBe(125)
      expect(document.documentElement.style.fontSize).toBe('125%')
    })

    it('should reject invalid indices', () => {
      const result = fontSizeManager.setFontSizeIndex(10)
      
      expect(result).toBe(false)
      expect(fontSizeManager.getCurrentIndex()).toBe(2) // should stay at default
    })

    it('should reject negative indices', () => {
      const result = fontSizeManager.setFontSizeIndex(-1)
      
      expect(result).toBe(false)
      expect(fontSizeManager.getCurrentIndex()).toBe(2)
    })
  })

  describe('button state management', () => {
    it('should disable decrease button at minimum', () => {
      fontSizeManager.setFontSizeIndex(0)
      
      expect(mockDecreaseButton.disabled).toBe(true)
      expect(mockIncreaseButton.disabled).toBe(false)
    })

    it('should disable increase button at maximum', () => {
      fontSizeManager.setFontSizeIndex(4)
      
      expect(mockIncreaseButton.disabled).toBe(true)
      expect(mockDecreaseButton.disabled).toBe(false)
    })

    it('should enable both buttons in middle range', () => {
      fontSizeManager.setFontSizeIndex(2)
      
      expect(mockDecreaseButton.disabled).toBe(false)
      expect(mockIncreaseButton.disabled).toBe(false)
    })
  })

  describe('reset functionality', () => {
    it('should reset to default font size', () => {
      fontSizeManager.setFontSizeIndex(4)
      fontSizeManager.reset()
      
      expect(fontSizeManager.getCurrentFontSize()).toBe(100)
      expect(fontSizeManager.getCurrentIndex()).toBe(2)
      expect(document.documentElement.style.fontSize).toBe('100%')
    })
  })

  describe('static factory method', () => {
    it('should create new instance via static method', () => {
      const staticManager = FontSizeManager.create()
      
      expect(staticManager).toBeInstanceOf(FontSizeManager)
      expect(staticManager.getCurrentFontSize()).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('should handle invalid localStorage values', () => {
      localStorage.setItem('fontSizeIndex', 'invalid')
      const newManager = new FontSizeManager()
      
      expect(newManager.getCurrentIndex()).toBe(2) // should fallback to default
    })

    it('should handle missing buttons gracefully', () => {
      mockDecreaseButton.remove()
      mockIncreaseButton.remove()
      const managerWithoutButtons = new FontSizeManager()
      
      // Should not throw errors
      expect(() => managerWithoutButtons.increaseFontSize()).not.toThrow()
      expect(() => managerWithoutButtons.decreaseFontSize()).not.toThrow()
    })

    it('should handle out of bounds localStorage values', () => {
      localStorage.setItem('fontSizeIndex', '99')
      const newManager = new FontSizeManager()
      
      expect(newManager.getCurrentIndex()).toBe(2) // should fallback to default
    })
  })

  describe('font sizes array', () => {
    it('should have correct font size values', () => {
      const expectedSizes = [87.5, 93.75, 100, 112.5, 125]
      
      expectedSizes.forEach((size, index) => {
        fontSizeManager.setFontSizeIndex(index)
        expect(fontSizeManager.getCurrentFontSize()).toBe(size)
      })
    })
  })
})