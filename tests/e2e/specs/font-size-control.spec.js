// @ts-check
import { test, expect } from '@playwright/test';
import { FontSizePage } from '../helpers/page-objects.js';
import { testUrls, testContent } from '../fixtures/test-data.js';
import { validateServerRunning } from '../helpers/server-check.js';

test.describe('Font Size Control', () => {
  // Validate server is running before any tests
  test.beforeAll(async () => {
    await validateServerRunning('http://localhost:4000');
  });
  /** @type {FontSizePage} */
  let fontSizePage;

  test.beforeEach(async ({ page }) => {
    fontSizePage = new FontSizePage(page);
    await page.goto(testUrls.homepage);
  });

  test('should increase font size', async ({ page }) => {
    const initialSize = await fontSizePage.getCurrentFontSize();
    expect(initialSize).toBeGreaterThanOrEqual(testContent.fontSizes.min);

    await fontSizePage.increaseFontSize();
    await page.waitForTimeout(300);

    const newSize = await fontSizePage.getCurrentFontSize();
    expect(newSize).toBeGreaterThan(initialSize);
  });

  test('should decrease font size', async ({ page }) => {
    // First increase to have room to decrease
    await fontSizePage.increaseFontSize();
    await page.waitForTimeout(300);
    
    const sizeAfterIncrease = await fontSizePage.getCurrentFontSize();

    await fontSizePage.decreaseFontSize();
    await page.waitForTimeout(300);

    const finalSize = await fontSizePage.getCurrentFontSize();
    expect(finalSize).toBeLessThan(sizeAfterIncrease);
  });

  test('should respect minimum font size limit', async ({ page }) => {
    const initialSize = await fontSizePage.getCurrentFontSize();
    
    // Try to decrease font size many times to hit the limit
    for (let i = 0; i < 10; i++) {
      const decreaseButton = page.locator('[data-font-decrease]');
      const isDisabled = await decreaseButton.isDisabled();
      if (isDisabled) break;
      
      await fontSizePage.decreaseFontSize();
      await page.waitForTimeout(100);
    }

    const finalSize = await fontSizePage.getCurrentFontSize();
    expect(finalSize).toBeGreaterThanOrEqual(testContent.fontSizes.min);
  });

  test('should respect maximum font size limit', async ({ page }) => {
    const initialSize = await fontSizePage.getCurrentFontSize();
    
    // Try to increase font size many times to hit the limit
    for (let i = 0; i < 10; i++) {
      const increaseButton = page.locator('[data-font-increase]');
      const isDisabled = await increaseButton.isDisabled();
      if (isDisabled) break;
      
      await fontSizePage.increaseFontSize();
      await page.waitForTimeout(100);
    }

    const finalSize = await fontSizePage.getCurrentFontSize();
    expect(finalSize).toBeLessThanOrEqual(testContent.fontSizes.max);
  });

  test('should persist font size preference', async ({ page }) => {
    const initialSize = await fontSizePage.getCurrentFontSize();
    
    // Change font size
    await fontSizePage.increaseFontSize();
    await fontSizePage.increaseFontSize();
    await page.waitForTimeout(500);

    // Check if font size is saved
    const isPersisted = await fontSizePage.isFontSizePersistedInStorage();
    expect(isPersisted).toBe(true);

    // Get stored value
    const storedSize = await page.evaluate(() => {
      return localStorage.getItem('fontSize') || 
             localStorage.getItem('selectedFontSize') ||
             localStorage.getItem('font-size');
    });
    expect(storedSize).toBeTruthy();
  });

  test('should maintain font size after page reload', async ({ page }) => {
    // Set a specific font size
    await fontSizePage.increaseFontSize();
    await fontSizePage.increaseFontSize();
    await page.waitForTimeout(500);
    
    const sizeBefore = await fontSizePage.getCurrentFontSize();

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Font size should be maintained
    const sizeAfter = await fontSizePage.getCurrentFontSize();
    expect(sizeAfter).toBe(sizeBefore);
  });

  test('should apply font size across different elements', async ({ page }) => {
    // Get initial font sizes for different elements
    const elements = ['h1', 'h2', 'p', 'a', 'li'];
    /** @type {Record<string, number>} */
    const initialSizes = {};
    
    for (const element of elements) {
      const elementExists = await page.locator(element).first().isVisible().catch(() => false);
      if (elementExists) {
        initialSizes[element] = await page.locator(element).first().evaluate((el) => {
          return parseInt(getComputedStyle(el).fontSize);
        });
      }
    }
    
    await fontSizePage.increaseFontSize();
    await page.waitForTimeout(500);

    // Check that font sizes have increased proportionally
    for (const element of Object.keys(initialSizes)) {
      const elementSize = await page.locator(element).first().evaluate((el) => {
        return parseInt(getComputedStyle(el).fontSize);
      });
      
      // Element font size should have increased
      expect(elementSize).toBeGreaterThanOrEqual(initialSizes[element]);
    }
  });

  test('should work across different pages', async ({ page }) => {
    // Set font size on homepage
    await fontSizePage.increaseFontSize();
    await fontSizePage.increaseFontSize();
    await page.waitForTimeout(500);
    
    const sizeOnHome = await fontSizePage.getCurrentFontSize();

    // Navigate to another page
    await page.goto(testUrls.gatilhos);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const sizeOnGatilhos = await fontSizePage.getCurrentFontSize();
    expect(sizeOnGatilhos).toBe(sizeOnHome);

    // Test ability to change font size on different page
    await fontSizePage.decreaseFontSize();
    await page.waitForTimeout(300);
    
    const newSize = await fontSizePage.getCurrentFontSize();
    expect(newSize).toBeLessThan(sizeOnGatilhos);
  });

  test('should have accessible font size control buttons', async ({ page }) => {
    const increaseBtn = page.locator('[data-font-increase]');
    const decreaseBtn = page.locator('[data-font-decrease]');
    
    // Buttons should be visible and clickable
    await expect(increaseBtn).toBeVisible();
    await expect(decreaseBtn).toBeVisible();
    await expect(increaseBtn).toBeEnabled();
    await expect(decreaseBtn).toBeEnabled();

    // Buttons should have accessible attributes
    const increaseHasLabel = await increaseBtn.evaluate((button) => {
      return button.hasAttribute('aria-label') || 
             button.hasAttribute('title') ||
             button.textContent?.trim().length > 0;
    });
    expect(increaseHasLabel).toBe(true);

    const decreaseHasLabel = await decreaseBtn.evaluate((button) => {
      return button.hasAttribute('aria-label') || 
             button.hasAttribute('title') ||
             button.textContent?.trim().length > 0;
    });
    expect(decreaseHasLabel).toBe(true);

    // Buttons should be keyboard accessible
    await increaseBtn.focus();
    await expect(increaseBtn).toBeFocused();
    
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    // Font size should have changed
    const sizeChanged = await page.evaluate(() => {
      return localStorage.getItem('fontSize') !== null ||
             localStorage.getItem('selectedFontSize') !== null;
    });
    expect(sizeChanged).toBe(true);
  });

  test('should handle rapid clicks gracefully', async ({ page }) => {
    const initialSize = await fontSizePage.getCurrentFontSize();
    
    // Click increase button rapidly
    for (let i = 0; i < 5; i++) {
      const increaseButton = page.locator('[data-font-increase]');
      const isDisabled = await increaseButton.isDisabled();
      if (isDisabled) break;
      
      await fontSizePage.increaseFontSize();
    }
    await page.waitForTimeout(500);
    
    const sizeAfterIncreases = await fontSizePage.getCurrentFontSize();
    expect(sizeAfterIncreases).toBeGreaterThan(initialSize);
    expect(sizeAfterIncreases).toBeLessThanOrEqual(testContent.fontSizes.max);
    
    // Click decrease button rapidly
    for (let i = 0; i < 8; i++) {
      const decreaseButton = page.locator('[data-font-decrease]');
      const isDisabled = await decreaseButton.isDisabled();
      if (isDisabled) break;
      
      await fontSizePage.decreaseFontSize();
    }
    await page.waitForTimeout(500);
    
    const finalSize = await fontSizePage.getCurrentFontSize();
    expect(finalSize).toBeGreaterThanOrEqual(testContent.fontSizes.min);
  });
});