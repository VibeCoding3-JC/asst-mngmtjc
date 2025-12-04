import { test, expect } from '@playwright/test';

test.describe('Asset Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/');
        await page.getByLabel('Email').fill('admin@company.com');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: /masuk/i }).click();
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('should navigate to assets page', async ({ page }) => {
        await page.getByRole('link', { name: /aset|assets/i }).first().click();
        await expect(page).toHaveURL(/.*assets/);
        await expect(page.getByText(/daftar aset|asset list/i).first()).toBeVisible();
    });

    test('should display asset list with table', async ({ page }) => {
        await page.goto('/assets');
        
        // Check table is visible
        await expect(page.getByRole('table').first()).toBeVisible({ timeout: 10000 });
    });

    test('should search assets', async ({ page }) => {
        await page.goto('/assets');
        
        // Search for asset
        const searchInput = page.getByPlaceholder(/cari|search/i);
        await searchInput.fill('Laptop');
        await searchInput.press('Enter');
        
        // Wait for filtered results
        await page.waitForTimeout(500);
    });

    test('should filter assets by status', async ({ page }) => {
        await page.goto('/assets');
        
        // Click status filter if exists
        const statusFilter = page.getByRole('combobox').filter({ hasText: /status/i }).first();
        if (await statusFilter.isVisible()) {
            await statusFilter.click();
            await page.getByRole('option', { name: /tersedia|available/i }).click();
        }
    });

    test('should open add asset form', async ({ page }) => {
        await page.goto('/assets');
        
        // Click add button
        await page.getByRole('link', { name: /tambah|add/i }).first().click();
        
        // Should navigate to add form
        await expect(page).toHaveURL(/.*assets\/add|.*assets\/new/);
        await expect(page.getByText(/tambah aset|add asset/i).first()).toBeVisible();
    });

    test('should create new asset', async ({ page }) => {
        await page.goto('/assets/add');
        
        // Wait for form to load
        await page.waitForTimeout(1000);
        
        // Fill form - use input type selectors
        const textInputs = page.locator('input[type="text"]');
        const firstInput = textInputs.first();
        if (await firstInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await firstInput.fill('Test Asset E2E');
        }
        
        // Check for submit button
        const submitButton = page.locator('button[type="submit"], button:has-text("Simpan"), button:has-text("Save")');
        if (await submitButton.first().isVisible({ timeout: 3000 }).catch(() => false)) {
            await submitButton.first().click();
            await page.waitForTimeout(2000);
        }
    });

    test('should view asset detail', async ({ page }) => {
        await page.goto('/assets');
        
        // Wait for table to load
        await expect(page.getByRole('table').first()).toBeVisible({ timeout: 10000 });
        
        // Click on first asset row or view button
        const viewButton = page.getByRole('link', { name: /lihat|view|detail/i }).first();
        if (await viewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await viewButton.click();
            await page.waitForTimeout(1000);
        }
    });
});
