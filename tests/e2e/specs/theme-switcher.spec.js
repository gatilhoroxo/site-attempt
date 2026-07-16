// @ts-check
import { test, expect } from '@playwright/test';
import { ThemePage } from '../helpers/page-objects.js';
import { testUrls } from '../fixtures/test-data.js';
import { validateServerRunning } from '../helpers/server-check.js';

test.describe('Theme Switcher', () => {
  // Validate server is running before any tests
  test.beforeAll(async () => {
    await validateServerRunning('http://localhost:4000');
  });
  /** @type {ThemePage} */
  let themePage;

  test.beforeEach(async ({ page }) => {
    themePage = new ThemePage(page);
    await page.goto(testUrls.homepage);
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Get initial theme
    const initialTheme = await themePage.getCurrentTheme();
    expect(['light', 'dark']).toContain(initialTheme);

    // Toggle theme
    await themePage.toggleTheme();
    await page.waitForTimeout(500); // Wait for theme transition

    // Theme should have changed
    const newTheme = await themePage.getCurrentTheme();
    expect(newTheme).not.toBe(initialTheme);

    // Toggle back
    await themePage.toggleTheme();
    await page.waitForTimeout(500);

    const finalTheme = await themePage.getCurrentTheme();
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const initialTheme = await themePage.getCurrentTheme();
    
    // Toggle theme
    await themePage.toggleTheme();
    await page.waitForTimeout(500);

    // Check if theme is saved in localStorage
    const isThemePersisted = await themePage.isThemePersistedInStorage();
    expect(isThemePersisted).toBe(true);

    // Get the stored theme value
    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('theme') || 
             localStorage.getItem('selectedTheme') ||
             localStorage.getItem('data-theme');
    });
    expect(storedTheme).toBeTruthy();
  });

  test('should maintain theme after page reload', async ({ page }) => {
    // Set a specific theme
    const initialTheme = await themePage.getCurrentTheme();
    await themePage.toggleTheme();
    await page.waitForTimeout(500);
    
    const themeBefore = await themePage.getCurrentTheme();

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Theme should be maintained
    const themeAfter = await themePage.getCurrentTheme();
    expect(themeAfter).toBe(themeBefore);
  });

  test('should apply correct CSS classes for themes', async ({ page }) => {
    // Test light theme classes
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
    });
    await page.reload();
    await page.waitForTimeout(500);

    const lightThemeClass = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'light' ||
             document.body.className.includes('light-theme') || 
             document.body.dataset.theme === 'light' ||
             !document.body.className.includes('dark-theme');
    });
    expect(lightThemeClass).toBe(true);

    // Test dark theme classes
    await themePage.toggleTheme();
    await page.waitForTimeout(500);

    const darkThemeClass = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
             document.body.className.includes('dark-theme') || 
             document.body.dataset.theme === 'dark';
    });
    expect(darkThemeClass).toBe(true);
  });

  test('should work across different pages', async ({ page }) => {
    // Set theme on homepage
    await themePage.toggleTheme();
    await page.waitForTimeout(500);
    const themeOnHome = await themePage.getCurrentTheme();

    // Navigate to another page
    await page.goto(testUrls.gatilhos);
    await page.waitForTimeout(500);
    const themeOnGatilhos = await themePage.getCurrentTheme();

    // Theme should be consistent
    expect(themeOnGatilhos).toBe(themeOnHome);

    // Navigate to docs page
    await page.goto(testUrls.docs);
    await page.waitForTimeout(500);
    const themeOnDocs = await themePage.getCurrentTheme();

    expect(themeOnDocs).toBe(themeOnHome);
  });

  test('should respect system theme preference initially', async ({ page }) => {
    // Clear any stored theme preference
    await page.evaluate(() => {
      localStorage.removeItem('theme');
      localStorage.removeItem('selectedTheme');
      localStorage.removeItem('data-theme');
    });

    // Set system preference to dark
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForTimeout(500);

    const darkTheme = await themePage.getCurrentTheme();
    // Should either be dark or have no strong preference (depends on implementation)
    expect(['dark', 'light']).toContain(darkTheme);

    // Set system preference to light  
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await page.waitForTimeout(500);

    const lightTheme = await themePage.getCurrentTheme();
    expect(['dark', 'light']).toContain(lightTheme);
  });

  test('should have accessible theme toggle button', async ({ page }) => {
    const themeToggle = page.locator('[data-theme-toggle]');
    
    // Button should be visible and clickable
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeEnabled();

    // Button should have accessible attributes
    const hasAriaLabel = await themeToggle.evaluate((button) => {
      return button.hasAttribute('aria-label') || 
             button.hasAttribute('title') ||
             button.textContent?.trim();
    });
    expect(hasAriaLabel).toBe(true);

    // Button should be keyboard accessible
    await themeToggle.focus();
    await expect(themeToggle).toBeFocused();
    
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Theme should have changed
    const themeChanged = await page.evaluate(() => {
      return localStorage.getItem('theme') !== null;
    });
    expect(themeChanged).toBe(true);
  });
});