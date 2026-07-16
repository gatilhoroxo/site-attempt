// Sidebar State Manager - Central system for managing sidebar states
export class SidebarStateManager {
  constructor() {
    this.currentState = null;
    this.states = new Map();
    this.sidebar = null;
    this.body = null;
    this.init();
  }

  init() {
    this.sidebar = document.getElementById('sidebar');
    this.body = document.body;
    
    if (!this.sidebar) {
      console.error('Sidebar element not found');
      return;
    }
    
    // Load saved state
    const savedState = localStorage.getItem('sidebarState');
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // Clear saved state when loading new page
    localStorage.setItem('sidebarState', 'null');
    
    // Ensure sidebar starts collapsed
    this.sidebar.classList.add('collapsed');
    this.body.classList.add('sidebar-collapsed');
    this.currentState = null;
    
    // Remove no-transition class after initial state is set
    this.removeTransitionClass();
    
    // Setup event listeners
    this.setupEventListeners();
    
    console.log('Sidebar State Manager initialized');
  }

  removeTransitionClass() {
    requestAnimationFrame(() => {
      this.body.classList.remove('no-transition');
    });
  }

  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
    
    // Close sidebar on mobile link click
    document.addEventListener('click', (e) => this.handleLinkClick(e));
    
    // Close sidebar on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Fechar se houver um state ativo ou se a sidebar estiver aberta
        if (this.currentState || this.isSidebarOpen()) {
          e.preventDefault();
          this.closeSidebar();
        }
      }
    });
    
    // Close sidebar when clicking outside (mobile only)
    document.addEventListener('click', (e) => {
      if (this.isMobile() && this.isSidebarOpen()) {
        const clickedInsideSidebar = this.sidebar.contains(e.target);
        const clickedButton = e.target.closest('[data-state-button]');
        
        if (!clickedInsideSidebar && !clickedButton) {
          this.closeSidebar();
        }
      }
    });
  }

  handleResize() {
    const isMobile = this.isMobile();
    
    if (isMobile) {
      // Mobile: remove desktop classes
      this.sidebar.classList.remove('collapsed');
      this.body.classList.remove('sidebar-collapsed');
    } else {
      // Desktop: remove mobile class and restore saved state if needed
      this.sidebar.classList.remove('mobile-open');
      
      if (!this.currentState) {
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
          this.sidebar.classList.add('collapsed');
          this.body.classList.add('sidebar-collapsed');
        }
      }
    }
  }

  handleLinkClick(e) {
    if (this.isMobile()) {
      const link = e.target.closest('.navigation-mode a, .search-mode a');
      if (link) {
        this.closeSidebar();
      }
    }
  }

  registerState(stateName, config) {
    if (!config.element || !config.button) {
      console.error(`State ${stateName} missing required config`);
      return false;
    }
    
    this.states.set(stateName, {
      element: config.element,
      button: config.button,
      onActivate: config.onActivate || (() => {}),
      onDeactivate: config.onDeactivate || (() => {})
    });
    
    // Add event listener to button
    config.button.addEventListener('click', () => {
      this.toggleState(stateName);
    });
    
    console.log(`State registered: ${stateName}`);
    return true;
  }

  toggleState(stateName) {
    const isMobile = this.isMobile();
    
    if (this.currentState === stateName) {
      // Clicking active state: close sidebar
      this.deactivateState(stateName);
      
      if (isMobile) {
        this.sidebar.classList.remove('mobile-open');
      } else {
        this.sidebar.classList.add('collapsed');
        this.body.classList.add('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', 'true');
      }
      
      this.currentState = null;
      localStorage.setItem('sidebarState', 'null');
    } else {
      // Clicking different state: switch states
      if (this.currentState) {
        this.deactivateState(this.currentState);
      }
      
      this.activateState(stateName);
      
      // Ensure sidebar is visible
      if (isMobile) {
        this.sidebar.classList.add('mobile-open');
        this.sidebar.classList.remove('collapsed');
        this.body.classList.remove('sidebar-collapsed');
      } else {
        this.sidebar.classList.remove('collapsed');
        this.body.classList.remove('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', 'false');
      }
      
      this.currentState = stateName;
      localStorage.setItem('sidebarState', stateName);
    }
  }

  activateState(stateName) {
    const state = this.states.get(stateName);
    if (!state) return false;
    
    // Hide all other state elements
    this.states.forEach((s, name) => {
      if (name !== stateName) {
        s.element.hidden = true;
        s.button.classList.remove('active');
        s.button.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Show current state element
    state.element.hidden = false;
    state.button.classList.add('active');
    state.button.setAttribute('aria-expanded', 'true');
    
    // Activation callback
    state.onActivate();
    
    console.log(`State activated: ${stateName}`);
    return true;
  }

  deactivateState(stateName) {
    const state = this.states.get(stateName);
    if (!state) return false;
    
    state.element.hidden = true;
    state.button.classList.remove('active');
    state.button.setAttribute('aria-expanded', 'false');
    
    // Deactivation callback
    state.onDeactivate();
    
    console.log(`State deactivated: ${stateName}`);
    return true;
  }

  closeSidebar() {
    const isMobile = this.isMobile();
    
    if (this.currentState) {
      this.deactivateState(this.currentState);
      this.currentState = null;
      localStorage.setItem('sidebarState', 'null');
    }
    
    if (isMobile) {
      this.sidebar.classList.remove('mobile-open');
    } else {
      this.sidebar.classList.add('collapsed');
      this.body.classList.add('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', 'true');
    }
    
    return true;
  }

  isSidebarOpen() {
    const isMobile = this.isMobile();
    
    if (isMobile) {
      return this.sidebar.classList.contains('mobile-open');
    } else {
      return !this.sidebar.classList.contains('collapsed');
    }
  }

  getCurrentState() {
    return this.currentState;
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  getRegisteredStates() {
    return Array.from(this.states.keys());
  }

  static create() {
    const instance = new SidebarStateManager();
    window.SidebarStateManager = instance;
    return instance;
  }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    SidebarStateManager.create();
  });
} else {
  SidebarStateManager.create();
}