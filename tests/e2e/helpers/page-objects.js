// Page Object Models for E2E tests
import { selectors } from '../fixtures/test-data.js';

export class SidebarPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    const sidebarToggle = await this.page.locator(selectors.sidebarToggle);
    await sidebarToggle.click();
  }

  async close() {
    // Try clicking outside sidebar or using ESC key
    await this.page.keyboard.press('Escape');
    // Wait for animation/transition
    await this.page.waitForTimeout(500);
  }

  async isOpen() {
    const sidebar = await this.page.locator(selectors.sidebar);
    const classAttr = await sidebar.getAttribute('class');
    // Sidebar is open if it doesn't have the "collapsed" class
    return classAttr !== null && !classAttr.includes('collapsed');
  }

  async switchToNavMode() {
    const navButton = await this.page.locator(selectors.sidebarNav);
    await navButton.click();
  }

  async switchToSearchMode() {
    const searchButton = await this.page.locator(selectors.sidebarSearch);
    await searchButton.click();
    // Wait for search mode to be activated and input to be visible
    await this.page.waitForTimeout(800);
    // Verify search input becomes visible
    const searchInput = this.page.locator(selectors.searchInput);
    await searchInput.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  }

  async switchToReposMode() {
    const reposButton = await this.page.locator(selectors.sidebarRepos);
    await reposButton.click();
  }

  async getCurrentMode() {
    // Check which mode is active based on classes or attributes
    if (await this.page.locator(selectors.sidebarNav + '.active').isVisible()) {
      return 'nav';
    }
    if (await this.page.locator(selectors.sidebarSearch + '.active').isVisible()) {
      return 'search';
    }
    if (await this.page.locator(selectors.sidebarRepos + '.active').isVisible()) {
      return 'repos';
    }
    return 'unknown';
  }
}

export class SearchPage {
  constructor(page) {
    this.page = page;
  }

  async search(query) {
    const searchInput = await this.page.locator(selectors.searchInput);
    // Check if input is visible, if not try to activate search mode
    const isVisible = await searchInput.isVisible().catch(() => false);
    if (!isVisible) {
      // Try clicking search button again
      const searchButton = await this.page.locator(selectors.sidebarSearch);
      await searchButton.click();
      await this.page.waitForTimeout(1000);
    }
    // Now wait for it to be visible
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await searchInput.fill(query);
    await this.page.waitForTimeout(300); // Debounce
  }

  async getResults() {
    const results = await this.page.locator(selectors.searchResults + ' [data-search-result]');
    return await results.all();
  }

  async getResultsCount() {
    const results = await this.getResults();
    return results.length;
  }

  async clickFirstResult() {
    const results = await this.getResults();
    if (results.length > 0) {
      await results[0].click();
    }
  }

  async isHighlightVisible(term) {
    // Check if search term is highlighted in results
    const highlight = await this.page.locator(`mark:has-text("${term}")`).first();
    return await highlight.isVisible();
  }
}

export class ThemePage {
  constructor(page) {
    this.page = page;
  }

  async toggleTheme() {
    const toggle = await this.page.locator(selectors.themeToggle);
    await toggle.click();
  }

  async getCurrentTheme() {
    // Check body class or data attribute for theme
    const theme = await this.page.evaluate(() => {
      const htmlElement = document.documentElement;
      const dataTheme = htmlElement.getAttribute('data-theme');
      if (dataTheme) {
        return dataTheme;
      }
      // Fallback to body class
      return document.body.classList.contains('dark-theme') || 
             document.body.dataset.theme === 'dark' ? 'dark' : 'light';
    });
    return theme;
  }

  async isThemePersistedInStorage() {
    const theme = await this.page.evaluate(() => {
      return localStorage.getItem('theme') || localStorage.getItem('selectedTheme');
    });
    return theme !== null;
  }
}

export class FontSizePage {
  constructor(page) {
    this.page = page;
  }

  async increaseFontSize() {
    const button = await this.page.locator(selectors.fontSizeIncrease);
    await button.click();
  }

  async decreaseFontSize() {
    const button = await this.page.locator(selectors.fontSizeDecrease);
    await button.click();
  }

  async getCurrentFontSize() {
    // Get computed font size from root or body element
    return await this.page.evaluate(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      return parseInt(rootStyle.fontSize);
    });
  }

  async isFontSizePersistedInStorage() {
    const fontSize = await this.page.evaluate(() => {
      return localStorage.getItem('fontSize') || localStorage.getItem('selectedFontSize');
    });
    return fontSize !== null;
  }
}

export class BreadcrumbPage {
  constructor(page) {
    this.page = page;
  }

  async getBreadcrumbItems() {
    const items = await this.page.locator(selectors.breadcrumbItems);
    return await items.all();
  }

  async getBreadcrumbText() {
    const items = await this.getBreadcrumbItems();
    const texts = [];
    for (const item of items) {
      const text = await item.textContent();
      texts.push(text.trim());
    }
    return texts;
  }

  async clickBreadcrumbItem(index) {
    const items = await this.getBreadcrumbItems();
    if (items[index]) {
      // Click on the link inside the breadcrumb item, not the item itself
      const link = items[index].locator('a.breadcrumb-link');
      const linkCount = await link.count();
      if (linkCount > 0) {
        await link.click();
      } else {
        // Fallback: if no link found, click the item (current/last item)
        await items[index].click();
      }
    }
  }

  async isVisible() {
    const breadcrumb = await this.page.locator(selectors.breadcrumb);
    return await breadcrumb.isVisible();
  }
}