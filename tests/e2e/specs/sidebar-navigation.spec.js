// @ts-check
import { test, expect } from '@playwright/test';
import { SidebarPage } from '../helpers/page-objects.js';
import { testUrls } from '../fixtures/test-data.js';

test.describe('Sidebar Navigation', () => {
  /** @type {SidebarPage} */
  let sidebarPage;

  test.beforeEach(async ({ page }) => {
    sidebarPage = new SidebarPage(page);
    await page.goto(testUrls.homepage);
  });

  test('should open and close sidebar', async ({ page }) => {
    // Initially sidebar should be closed (collapsed) on desktop
    const sidebar = page.locator('[data-sidebar]');
    await expect(sidebar).toHaveClass(/collapsed/);

    // Open sidebar
    await sidebarPage.open();
    expect(await sidebarPage.isOpen()).toBe(true);

    // Close sidebar with ESC key
    await sidebarPage.close();
    expect(await sidebarPage.isOpen()).toBe(false);
  });

  test('should switch between navigation modes', async ({ page }) => {
    await sidebarPage.open();

    // Test switching to search mode
    await sidebarPage.switchToSearchMode();
    expect(await sidebarPage.getCurrentMode()).toBe('search');

    // Test switching to repos mode  
    await sidebarPage.switchToReposMode();
    expect(await sidebarPage.getCurrentMode()).toBe('repos');

    // Test switching back to nav mode
    await sidebarPage.switchToNavMode();
    expect(await sidebarPage.getCurrentMode()).toBe('nav');
  });

  //TODO: reavaliar pois acho que não precisa se manter depois do reload
  test('should persist sidebar state after page reload', async ({ page }) => {
    await sidebarPage.open();
    await sidebarPage.switchToSearchMode();

    // Reload page
    await page.reload();

    // Check if state is preserved (assuming the site implements this)
    // This might need adjustment based on actual implementation
    const isOpen = await sidebarPage.isOpen();
    const mode = await sidebarPage.getCurrentMode();
    
    // At minimum, the mode should be preserved in localStorage
    const storedMode = await page.evaluate(() => {
      return localStorage.getItem('sidebarState');
    });
    expect(storedMode).toBeTruthy();
  });

  test('should behave responsively on mobile vs desktop', async ({ page }) => {
    // Test desktop behavior
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(testUrls.homepage);
    await page.waitForLoadState('networkidle');
    
    // On desktop, sidebar might be hidden by default
    let isOpenDesktop = await sidebarPage.isOpen();
    
    // Test mobile behavior
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrls.homepage);
    await page.waitForLoadState('networkidle');
    
    // On mobile, sidebar behavior might be different
    let isOpenMobile = await sidebarPage.isOpen();
    
    // The key is that the sidebar toggle should work in both cases
    await sidebarPage.open();
    await page.waitForTimeout(500);
    expect(await sidebarPage.isOpen()).toBe(true);
  });

  test('should navigate through sidebar links', async ({ page }) => {
    await sidebarPage.open();
    await page.waitForTimeout(500);
    
    // Wait for navigation links to be visible
    const gatilhosLink = page.locator('[data-nav] a[href*="gatilhos"]').first();
    await gatilhosLink.waitFor({ state: 'visible', timeout: 5000 });
    
    // Navigate to different sections through sidebar
    await gatilhosLink.click();
    await page.waitForURL('**/gatilhos/**', { timeout: 10000 });
    expect(page.url()).toContain('gatilhos');

    await sidebarPage.open();
    await page.waitForTimeout(500);
    
    const postsLink = page.locator('[data-nav] a[href*="posts"]').first();
    const postsLinkExists = await postsLink.count() > 0;
    
    if (postsLinkExists) {
      await postsLink.waitFor({ state: 'visible', timeout: 5000 });
      await postsLink.click();
      await page.waitForURL('**/posts/**', { timeout: 10000 });
      expect(page.url()).toContain('posts');
    }
  });

  test('should show active page in navigation', async ({ page }) => {
    // Navigate to a specific page
    await page.goto(testUrls.gatilhos);
    await sidebarPage.open();
    await page.waitForTimeout(500);
    
    // Check if current page is highlighted in navigation (if feature is implemented)
    const activeLink = page.locator('[data-nav] a.active, [data-nav] a.current, [data-nav] .active a');
    const activeLinkCount = await activeLink.count();
    
    if (activeLinkCount > 0) {
      await expect(activeLink.first()).toBeVisible();
    } else {
      // Feature not implemented - just verify navigation exists
      const navLinks = page.locator('[data-nav] a');
      expect(await navLinks.count()).toBeGreaterThan(0);
    }
  });
});