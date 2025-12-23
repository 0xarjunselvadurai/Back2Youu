import { test, expect } from '@playwright/test';

// Simple smoke tests for your main navbar links
const routes = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'About Us', path: '/about' },
  { label: 'News Feed', path: '/news-feed' },
];

for (const route of routes) {
  test(`navbar has correct link for ${route.label}`, async ({ page }) => {
    // Open home page once per test
    await page.goto('/');

    // Find the nav link by its visible label
    const link = page.getByRole('link', { name: route.label }).first();

    // Assert the href attribute is correct (no need to navigate)
    await expect(link).toHaveAttribute('href', route.path);
  });
}
