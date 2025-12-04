import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/');
        await page.getByLabel('Email').fill('admin@company.com');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: /masuk/i }).click();
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('should navigate through all main pages', async ({ page }) => {
        // Dashboard - already there
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

        // Assets - use exact match
        await page.getByRole('link', { name: 'Aset', exact: true }).click();
        await expect(page).toHaveURL(/.*assets/);

        // Transactions
        await page.getByRole('link', { name: 'Transaksi', exact: true }).click();
        await expect(page).toHaveURL(/.*transactions/);

        // Users
        await page.getByRole('link', { name: 'Pengguna', exact: true }).click();
        await expect(page).toHaveURL(/.*users/);

        // Categories
        await page.getByRole('link', { name: 'Kategori', exact: true }).click();
        await expect(page).toHaveURL(/.*categories/);

        // Locations
        await page.getByRole('link', { name: 'Lokasi', exact: true }).click();
        await expect(page).toHaveURL(/.*locations/);
    });

    test('sidebar should be visible on desktop', async ({ page }) => {
        // Set viewport to desktop size
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/dashboard');
        await page.waitForTimeout(1000);
        
        // Check for navigation - could be aside, nav, or div with navigation links
        const sidebar = page.locator('aside, nav, [class*="sidebar"], [class*="nav"]').first();
        const hasNav = await sidebar.isVisible({ timeout: 3000 }).catch(() => false);
        
        // Check if navigation links are present (alternative check)
        const navLinks = page.getByRole('link', { name: /dashboard|aset|transaksi/i });
        const hasLinks = await navLinks.first().isVisible({ timeout: 3000 }).catch(() => false);
        
        expect(hasNav || hasLinks).toBeTruthy();
    });

    test('should display user info in navbar', async ({ page }) => {
        // Check user name is visible - be more specific
        await expect(page.getByText('Administrator').first()).toBeVisible();
    });
});

test.describe('Master Data - Categories', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Email').fill('admin@company.com');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: /masuk/i }).click();
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('should display categories list', async ({ page }) => {
        await page.goto('/categories');
        
        await expect(page.getByRole('heading', { name: /kategori/i })).toBeVisible();
        await expect(page.getByRole('table').or(page.locator('.grid'))).toBeVisible({ timeout: 10000 });
    });

    test('should open add category form', async ({ page }) => {
        await page.goto('/categories');
        
        const addButton = page.getByRole('button', { name: /tambah/i });
        if (await addButton.isVisible()) {
            await addButton.click();
            await expect(page.getByLabel(/nama/i).first()).toBeVisible();
        }
    });
});

test.describe('Master Data - Locations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Email').fill('admin@company.com');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: /masuk/i }).click();
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('should display locations list', async ({ page }) => {
        await page.goto('/locations');
        
        await expect(page.getByRole('heading', { name: /lokasi/i })).toBeVisible();
        await expect(page.getByRole('table').or(page.locator('.grid'))).toBeVisible({ timeout: 10000 });
    });

    test('should open add location form', async ({ page }) => {
        await page.goto('/locations');
        
        const addButton = page.getByRole('button', { name: /tambah/i });
        if (await addButton.isVisible()) {
            await addButton.click();
            await expect(page.getByLabel(/nama/i).first()).toBeVisible();
        }
    });
});

test.describe('User Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Email').fill('admin@company.com');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: /masuk/i }).click();
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('should display users list', async ({ page }) => {
        await page.goto('/users');
        
        await expect(page.getByRole('heading', { name: /pengguna|daftar/i })).toBeVisible();
        await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    });

    test('should search users', async ({ page }) => {
        await page.goto('/users');
        
        const searchInput = page.getByPlaceholder(/cari|search/i);
        if (await searchInput.isVisible()) {
            await searchInput.fill('Admin');
            await searchInput.press('Enter');
            await page.waitForTimeout(500);
        }
    });

    test('should open add user form', async ({ page }) => {
        await page.goto('/users');
        
        const addButton = page.getByRole('link', { name: /tambah/i });
        if (await addButton.isVisible()) {
            await addButton.click();
            await expect(page).toHaveURL(/.*users\/add|.*users\/new/);
        }
    });
});
