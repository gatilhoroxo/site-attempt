// Theme Manager - Handles dark/light theme switching
export class ThemeManager {
  constructor() {
    this.themeToggle = null;
    this.currentTheme = null;
    this.init();
  }

  init() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set theme immediately without transitions
    this.applyTheme(this.currentTheme);
    this.updateToggleButton();
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
  }

  updateToggleButton() {
    if (this.themeToggle) {
      this.themeToggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
    this.updateToggleButton();
    return newTheme;
  }

  saveTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  static create() {
    return new ThemeManager();
  }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.create();
  });
} else {
  ThemeManager.create();
}