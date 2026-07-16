// Sidebar State Manager Tests
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SidebarStateManager } from '@/sidebar-state-manager.js'

describe('SidebarStateManager', () => {
  let sidebarStateManager
  let mockSidebar
  let mockBody
  let mockStateElement
  let mockStateButton

  beforeEach(() => {
    // Setup DOM
    mockSidebar = document.createElement('div')
    mockSidebar.id = 'sidebar'
    mockBody = document.body
    
    mockStateElement = document.createElement('div')
    mockStateElement.id = 'test-state-element'
    
    mockStateButton = document.createElement('button')
    mockStateButton.id = 'test-state-button'
    
    document.body.appendChild(mockSidebar)
    document.body.appendChild(mockStateElement)
    document.body.appendChild(mockStateButton)
    
    // Clear localStorage mock
    localStorage.clear()
    
    // Reset classes
    mockSidebar.className = ''
    mockBody.className = ''
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })
    
    // Create sidebar state manager instance
    sidebarStateManager = new SidebarStateManager()
  })

  describe('initialization', () => {
    it('should initialize with sidebar collapsed', () => {
      expect(mockSidebar.classList.contains('collapsed')).toBe(true)
      expect(mockBody.classList.contains('sidebar-collapsed')).toBe(true)
      expect(sidebarStateManager.getCurrentState()).toBeNull()
    })

    it('should clear saved state on initialization', () => {
      expect(localStorage.setItem).toHaveBeenCalledWith('sidebarState', 'null')
    })

    it('should handle missing sidebar element', () => {
      mockSidebar.remove()
      const managerWithoutSidebar = new SidebarStateManager()
      
      expect(() => managerWithoutSidebar.init()).not.toThrow()
    })
  })

  describe('state registration', () => {
    it('should register a new state successfully', () => {
      const config = {
        element: mockStateElement,
        button: mockStateButton,
        onActivate: vi.fn(),
        onDeactivate: vi.fn()
      }
      
      const result = sidebarStateManager.registerState('test-state', config)
      
      expect(result).toBe(true)
      expect(sidebarStateManager.getRegisteredStates()).toContain('test-state')
    })

    it('should fail to register state without required config', () => {
      const incompleteConfig = { element: mockStateElement }
      
      const result = sidebarStateManager.registerState('incomplete', incompleteConfig)
      
      expect(result).toBe(false)
    })

    it('should add click listener to state button', () => {
      const config = {
        element: mockStateElement,
        button: mockStateButton,
        onActivate: vi.fn(),
        onDeactivate: vi.fn()
      }
      
      sidebarStateManager.registerState('test-state', config)
      
      // Click the button and verify state toggle
      mockStateButton.click()
      expect(sidebarStateManager.getCurrentState()).toBe('test-state')
    })
  })

  describe('state activation and deactivation', () => {
    beforeEach(() => {
      const config = {
        element: mockStateElement,
        button: mockStateButton,
        onActivate: vi.fn(),
        onDeactivate: vi.fn()
      }
      sidebarStateManager.registerState('test-state', config)
    })

    it('should activate state correctly', () => {
      const result = sidebarStateManager.activateState('test-state')
      
      expect(result).toBe(true)
      expect(mockStateElement.hidden).toBe(false)
      expect(mockStateButton.classList.contains('active')).toBe(true)
    })

    it('should deactivate state correctly', () => {
      sidebarStateManager.activateState('test-state')
      const result = sidebarStateManager.deactivateState('test-state')
      
      expect(result).toBe(true)
      expect(mockStateElement.hidden).toBe(true)
      expect(mockStateButton.classList.contains('active')).toBe(false)
    })

    it('should call activation callback', () => {
      const config = {
        element: mockStateElement,
        button: mockStateButton,
        onActivate: vi.fn(),
        onDeactivate: vi.fn()
      }
      sidebarStateManager.registerState('callback-state', config)
      
      sidebarStateManager.activateState('callback-state')
      
      expect(config.onActivate).toHaveBeenCalled()
    })

    it('should call deactivation callback', () => {
      const config = {
        element: mockStateElement,
        button: mockStateButton,
        onActivate: vi.fn(),
        onDeactivate: vi.fn()
      }
      sidebarStateManager.registerState('callback-state', config)
      
      sidebarStateManager.activateState('callback-state')
      sidebarStateManager.deactivateState('callback-state')
      
      expect(config.onDeactivate).toHaveBeenCalled()
    })
  })

  describe('state toggling', () => {
    beforeEach(() => {
      const config = {
        element: mockStateElement,
        button: mockStateButton,
        onActivate: vi.fn(),
        onDeactivate: vi.fn()
      }
      sidebarStateManager.registerState('test-state', config)
    })

    it('should toggle from inactive to active', () => {
      sidebarStateManager.toggleState('test-state')
      
      expect(sidebarStateManager.getCurrentState()).toBe('test-state')
      expect(mockSidebar.classList.contains('collapsed')).toBe(false)
      expect(mockBody.classList.contains('sidebar-collapsed')).toBe(false)
    })

    it('should toggle from active to inactive', () => {
      sidebarStateManager.toggleState('test-state') // activate
      sidebarStateManager.toggleState('test-state') // deactivate
      
      expect(sidebarStateManager.getCurrentState()).toBeNull()
      expect(mockSidebar.classList.contains('collapsed')).toBe(true)
      expect(mockBody.classList.contains('sidebar-collapsed')).toBe(true)
    })

    it('should save state to localStorage when activated', () => {
      sidebarStateManager.toggleState('test-state')
      
      expect(localStorage.setItem).toHaveBeenCalledWith('sidebarState', 'test-state')
      expect(localStorage.setItem).toHaveBeenCalledWith('sidebarCollapsed', 'false')
    })
  })

  describe('mobile behavior', () => {
    beforeEach(() => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })
      
      const config = {
        element: mockStateElement,
        button: mockStateButton,
        onActivate: vi.fn(),
        onDeactivate: vi.fn()
      }
      sidebarStateManager.registerState('test-state', config)
    })

    it('should detect mobile viewport correctly', () => {
      expect(sidebarStateManager.isMobile()).toBe(true)
    })

    it('should use mobile-open class on mobile', () => {
      sidebarStateManager.toggleState('test-state')
      
      expect(mockSidebar.classList.contains('mobile-open')).toBe(true)
      expect(mockSidebar.classList.contains('collapsed')).toBe(false)
    })

    it('should remove mobile-open class when deactivating on mobile', () => {
      sidebarStateManager.toggleState('test-state') // activate
      sidebarStateManager.toggleState('test-state') // deactivate
      
      expect(mockSidebar.classList.contains('mobile-open')).toBe(false)
    })
  })

  describe('sidebar status methods', () => {
    beforeEach(() => {
      const config = {
        element: mockStateElement,
        button: mockStateButton
      }
      sidebarStateManager.registerState('test-state', config)
    })

    it('should correctly report sidebar open status on desktop', () => {
      expect(sidebarStateManager.isSidebarOpen()).toBe(false)
      
      sidebarStateManager.toggleState('test-state')
      expect(sidebarStateManager.isSidebarOpen()).toBe(true)
    })

    it('should correctly report sidebar open status on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 375
      })
      
      expect(sidebarStateManager.isSidebarOpen()).toBe(false)
      
      sidebarStateManager.toggleState('test-state')
      expect(sidebarStateManager.isSidebarOpen()).toBe(true)
    })
  })

  describe('sidebar closing', () => {
    beforeEach(() => {
      const config = {
        element: mockStateElement,
        button: mockStateButton
      }
      sidebarStateManager.registerState('test-state', config)
    })

    it('should close sidebar completely', () => {
      sidebarStateManager.toggleState('test-state') // open
      const result = sidebarStateManager.closeSidebar()
      
      expect(result).toBe(true)
      expect(sidebarStateManager.getCurrentState()).toBeNull()
      expect(sidebarStateManager.isSidebarOpen()).toBe(false)
    })
  })

  describe('window resize handling', () => {
    beforeEach(() => {
      const config = {
        element: mockStateElement,
        button: mockStateButton
      }
      sidebarStateManager.registerState('test-state', config)
    })

    it('should handle resize from desktop to mobile', () => {
      // Start desktop
      window.innerWidth = 1024
      sidebarStateManager.handleResize()
      
      // Switch to mobile
      window.innerWidth = 375
      sidebarStateManager.handleResize()
      
      expect(mockSidebar.classList.contains('collapsed')).toBe(false)
      expect(mockBody.classList.contains('sidebar-collapsed')).toBe(false)
    })

    it('should handle resize from mobile to desktop', () => {
      // Start mobile
      window.innerWidth = 375
      sidebarStateManager.handleResize()
      
      // Switch to desktop
      window.innerWidth = 1024
      sidebarStateManager.handleResize()
      
      expect(mockSidebar.classList.contains('mobile-open')).toBe(false)
    })
  })

  describe('static factory method', () => {
    it('should create new instance and set global reference', () => {
      const staticManager = SidebarStateManager.create()
      
      expect(staticManager).toBeInstanceOf(SidebarStateManager)
      expect(window.SidebarStateManager).toBe(staticManager)
    })
  })

  describe('multiple states', () => {
    let mockStateElement2
    let mockStateButton2

    beforeEach(() => {
      mockStateElement2 = document.createElement('div')
      mockStateElement2.id = 'test-state-element-2'
      mockStateButton2 = document.createElement('button')
      mockStateButton2.id = 'test-state-button-2'
      
      document.body.appendChild(mockStateElement2)
      document.body.appendChild(mockStateButton2)
      
      sidebarStateManager.registerState('state-1', {
        element: mockStateElement,
        button: mockStateButton
      })
      
      sidebarStateManager.registerState('state-2', {
        element: mockStateElement2,
        button: mockStateButton2
      })
    })

    it('should switch between different states', () => {
      sidebarStateManager.toggleState('state-1')
      expect(sidebarStateManager.getCurrentState()).toBe('state-1')
      
      sidebarStateManager.toggleState('state-2')
      expect(sidebarStateManager.getCurrentState()).toBe('state-2')
      expect(mockStateElement.hidden).toBe(true)
      expect(mockStateElement2.hidden).toBe(false)
    })
  })
})