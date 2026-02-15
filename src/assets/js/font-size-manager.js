// Font Size Manager - Handles font size control
export class FontSizeManager {
  constructor() {
    this.fontDecrease = null;
    this.fontIncrease = null;
    // Font sizes in percentage (14px, 15px, 16px, 18px, 20px when base is 16px)
    this.fontSizes = [87.5, 93.75, 100, 112.5, 125];
    this.defaultIndex = 2; // 100% = 16px
    this.currentIndex = null;
    this.init();
  }

  init() {
    this.fontDecrease = document.getElementById('font-decrease');
    this.fontIncrease = document.getElementById('font-increase');
    
    // Load saved index or use default
    const savedIndex = localStorage.getItem('fontSizeIndex');
    const parsedIndex = savedIndex !== null ? parseInt(savedIndex) : null;
    
    // Validate saved index is within bounds and not NaN
    if (parsedIndex !== null && !isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < this.fontSizes.length) {
      this.currentIndex = parsedIndex;
    } else {
      this.currentIndex = this.defaultIndex;
    }
    
    // Apply initial font size
    this.applyFontSize();
    
    // Bind event listeners
    if (this.fontDecrease) {
      this.fontDecrease.addEventListener('click', () => this.decreaseFontSize());
    }
    
    if (this.fontIncrease) {
      this.fontIncrease.addEventListener('click', () => this.increaseFontSize());
    }
  }

  applyFontSize() {
    const fontSize = this.fontSizes[this.currentIndex];
    document.documentElement.style.fontSize = fontSize + '%';
    
    // Update button states
    this.updateButtonStates();
    
    // Save to localStorage
    this.saveFontSizeIndex();
  }

  updateButtonStates() {
    if (this.fontDecrease) {
      this.fontDecrease.disabled = this.currentIndex === 0;
    }
    
    if (this.fontIncrease) {
      this.fontIncrease.disabled = this.currentIndex === this.fontSizes.length - 1;
    }
  }

  decreaseFontSize() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.applyFontSize();
      return this.getCurrentFontSize();
    }
    return null;
  }

  increaseFontSize() {
    if (this.currentIndex < this.fontSizes.length - 1) {
      this.currentIndex++;
      this.applyFontSize();
      return this.getCurrentFontSize();
    }
    return null;
  }

  getCurrentFontSize() {
    return this.fontSizes[this.currentIndex];
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  setFontSizeIndex(index) {
    if (index >= 0 && index < this.fontSizes.length) {
      this.currentIndex = index;
      this.applyFontSize();
      return true;
    }
    return false;
  }

  saveFontSizeIndex() {
    localStorage.setItem('fontSizeIndex', this.currentIndex.toString());
    localStorage.setItem('selectedFontSize', this.fontSizes[this.currentIndex].toString());
    localStorage.setItem('fontSize', this.fontSizes[this.currentIndex].toString());
  }

  reset() {
    this.currentIndex = this.defaultIndex;
    this.applyFontSize();
  }

  static create() {
    return new FontSizeManager();
  }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    FontSizeManager.create();
  });
} else {
  FontSizeManager.create();
}