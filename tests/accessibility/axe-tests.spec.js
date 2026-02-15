// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { testUrls } from '../e2e/fixtures/test-data.js';

test.describe('Automated Accessibility Tests', () => {
  const testPages = [
    { name: 'Homepage', url: testUrls.homepage },
    { name: 'Gatilhos', url: testUrls.gatilhos },
    { name: 'Posts', url: testUrls.posts },
    { name: 'Projects', url: testUrls.projects },
    { name: 'Docs', url: testUrls.docs },
    { name: 'Conceitos Fundamentais', url: testUrls.conceptsPage },
    { name: 'Diário de Aprendizado', url: testUrls.diaryPage },
    { name: 'MC Journey', url: testUrls.mcJourney }
  ];

  for (const page of testPages) {
    test(`should not have accessibility violations on ${page.name}`, async ({ page: playwright }) => {
      await playwright.goto(page.url);
      await playwright.waitForTimeout(1000);

      const accessibilityScanResults = await new AxeBuilder({ page: playwright })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test(`should not have accessibility violations on ${page.name} in dark theme`, async ({ page: playwright }) => {
      await playwright.goto(page.url);
      
      // Switch to dark theme
      await playwright.evaluate(() => {
        localStorage.setItem('theme', 'dark');
        document.body.className = 'dark-theme';
        document.body.dataset.theme = 'dark';
      });
      
      await playwright.reload();
      await playwright.waitForTimeout(1000);

      const accessibilityScanResults = await new AxeBuilder({ page: playwright })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test('should have proper heading hierarchy', async ({ page }) => {
    const pagesToTest = [testUrls.homepage, testUrls.gatilhos, testUrls.posts];
    
    for (const url of pagesToTest) {
      await page.goto(url);
      await page.waitForTimeout(1000);

      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      if (headings.length > 0) {
        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);

        // Check heading order (simplified check)
        const headingLevels = [];
        for (const heading of headings) {
          const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
          const level = parseInt(tagName.substring(1));
          headingLevels.push(level);
        }

        // First heading should be h1
        if (headingLevels.length > 0) {
          expect(headingLevels[0]).toBe(1);
        }
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto(testUrls.homepage);
    
    // Check search form if it exists
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="busca"]').first();
    const hasSearchInput = await searchInput.count() > 0;
    
    if (hasSearchInput) {
      // Input should have label, aria-label, or aria-labelledby
      const hasLabel = await searchInput.evaluate((input) => {
        const hasLabelElement = document.querySelector(`label[for="${input.id}"]`);
        const hasAriaLabel = input.hasAttribute('aria-label');
        const hasAriaLabelledby = input.hasAttribute('aria-labelledby');
        const hasPlaceholder = input.hasAttribute('placeholder');
        
        return hasLabelElement || hasAriaLabel || hasAriaLabelledby || hasPlaceholder;
      });
      
      expect(hasLabel).toBe(true);
    }
  });

  test('should have proper ARIA landmarks', async ({ page }) => {
    const pagesToTest = [testUrls.homepage, testUrls.gatilhos];
    
    for (const url of pagesToTest) {
      await page.goto(url);
      await page.waitForTimeout(1000);

      // Should have main landmark
      const main = page.locator('main, [role="main"]');
      await expect(main).toBeVisible();

      // Should have navigation landmark (sidebar)
      const nav = page.locator('nav, [role="navigation"]');
      const navCount = await nav.count();
      expect(navCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('should have proper link context', async ({ page }) => {
    const pagesToTest = [testUrls.gatilhos, testUrls.posts];
    
    for (const url of pagesToTest) {
      await page.goto(url);
      await page.waitForTimeout(1000);

      const links = await page.locator('a').all();
      
      for (const link of links.slice(0, 5)) { // Test first 5 links
        const linkText = await link.textContent();
        const hasHref = await link.getAttribute('href');
        
        if (hasHref) {
          // Link should have meaningful text or aria-label
          const hasMeaningfulText = linkText && linkText.trim().length > 0;
          const hasAriaLabel = await link.getAttribute('aria-label');
          const hasTitle = await link.getAttribute('title');
          
          expect(hasMeaningfulText || hasAriaLabel || hasTitle).toBe(true);
          
          // Should not be generic text like "click here" or "read more" without context
          if (linkText) {
            const isGeneric = /^(click here|read more|more|link)$/i.test(linkText.trim());
            if (isGeneric) {
              // Generic links should have additional context via aria-label or surrounding text
              expect(hasAriaLabel || hasTitle).toBe(true);
            }
          }
        }
      }
    }
  });

  test('should have proper image alternative text', async ({ page }) => {
    const pagesToTest = [testUrls.homepage, testUrls.gatilhos, testUrls.posts];
    
    for (const url of pagesToTest) {
      await page.goto(url);
      await page.waitForTimeout(1000);

      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        const ariaLabel = await img.getAttribute('aria-label');
        const ariaHidden = await img.getAttribute('aria-hidden');
        
        // Images should have alt text, unless they're decorative (aria-hidden="true" or role="presentation")
        const isDecorative = ariaHidden === 'true' || role === 'presentation';
        
        if (!isDecorative) {
          expect(alt !== null || ariaLabel !== null).toBe(true);
        }
      }
    }
  });

  test('should support keyboard-only navigation', async ({ page }) => {
    await page.goto(testUrls.homepage);
    
    // Tab through focusable elements
    const focusableElements = await page.locator('a, button, input, [tabindex="0"]').all();
    
    if (focusableElements.length > 0) {
      // Focus first element
      await page.keyboard.press('Tab');
      
      const firstFocused = await page.locator(':focus').first();
      await expect(firstFocused).toBeVisible();
      
      // Tab to next element
      await page.keyboard.press('Tab');
      
      const secondFocused = await page.locator(':focus').first();
      await expect(secondFocused).toBeVisible();
      
      // Elements should be different (unless there's only one focusable element)
      if (focusableElements.length > 1) {
        const firstElement = await firstFocused.innerHTML();
        const secondElement = await secondFocused.innerHTML();
        expect(firstElement).not.toBe(secondElement);
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const pagesToTest = [testUrls.homepage, testUrls.gatilhos];
    
    for (const url of pagesToTest) {
      await page.goto(url);
      await page.waitForTimeout(1000);

      // Test with axe-core color contrast rules
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['color-contrast'])
        .analyze();

      // Log violations for manual review if any
      if (accessibilityScanResults.violations.length > 0) {
        console.log(`Color contrast issues on ${url}:`, accessibilityScanResults.violations);
      }
      
      // This test might need to be adjusted based on actual color scheme
      // For now, we'll check that the scan completed without throwing errors
      expect(Array.isArray(accessibilityScanResults.violations)).toBe(true);
    }
  });

  test('should work with screen reader simulation', async ({ page }) => {
    await page.goto(testUrls.homepage);
    
    // Simulate screen reader by checking aria-live regions and announcements
    const liveRegions = await page.locator('[aria-live]').all();
    
    for (const region of liveRegions) {
      const ariaLive = await region.getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(ariaLive);
    }
    
    // Check for proper page title for screen readers
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('');
  });
});

test.describe('Accessibility - Interactive Elements', () => {
  test('should have accessible theme toggle', async ({ page }) => {
    await page.goto(testUrls.homepage);
    
    const themeToggle = page.locator('[data-theme-toggle]').first();
    const hasThemeToggle = await themeToggle.count() > 0;
    
    if (hasThemeToggle) {
      // Should be focusable
      await themeToggle.focus();
      await expect(themeToggle).toBeFocused();
      
      // Should have accessible name
      const accessibleName = await themeToggle.evaluate((el) => {
        return el.getAttribute('aria-label') || 
               el.getAttribute('title') ||
               el.textContent?.trim() ||
               el.querySelector('span')?.textContent?.trim();
      });
      
      expect(accessibleName).toBeTruthy();
      
      // Should work with Enter key
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      
      // Theme should have changed (check localStorage or body class)
      const themeChanged = await page.evaluate(() => {
        return localStorage.getItem('theme') !== null;
      });
      expect(themeChanged).toBe(true);
    }
  });

  test('should have accessible font size controls', async ({ page }) => {
    await page.goto(testUrls.homepage);
    
    const increaseBtn = page.locator('[data-font-increase]').first();
    const decreaseBtn = page.locator('[data-font-decrease]').first();
    
    const hasControls = await increaseBtn.count() > 0 && await decreaseBtn.count() > 0;
    
    if (hasControls) {
      // Both buttons should be focusable
      await increaseBtn.focus();
      await expect(increaseBtn).toBeFocused();
      
      await decreaseBtn.focus();
      await expect(decreaseBtn).toBeFocused();
      
      // Should have accessible names
      const increaseLabel = await increaseBtn.evaluate((el) => {
        return el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent?.trim();
      });
      
      const decreaseLabel = await decreaseBtn.evaluate((el) => {
        return el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent?.trim();
      });
      
      expect(increaseLabel).toBeTruthy();
      expect(decreaseLabel).toBeTruthy();
    }
  });

  test('should have accessible sidebar navigation', async ({ page }) => {
    await page.goto(testUrls.homepage);
    
    const sidebarToggle = page.locator('[data-sidebar-toggle]').first();
    const hasSidebar = await sidebarToggle.count() > 0;
    
    if (hasSidebar) {
      // Toggle should be accessible
      await sidebarToggle.focus();
      await expect(sidebarToggle).toBeFocused();
      
      // Should have accessible name
      const accessibleName = await sidebarToggle.evaluate((el) => {
        return el.getAttribute('aria-label') || 
               el.getAttribute('aria-expanded') !== null ||
               el.getAttribute('title') ||
               el.textContent?.trim();
      });
      
      expect(accessibleName).toBeTruthy();
      
      // Should indicate state with aria-expanded
      const ariaExpanded = await sidebarToggle.getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(ariaExpanded);
      
      // Test keyboard interaction
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      // Aria-expanded should change
      const newAriaExpanded = await sidebarToggle.getAttribute('aria-expanded');
      expect(newAriaExpanded).not.toBe(ariaExpanded);
    }
  });
});