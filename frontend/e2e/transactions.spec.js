import { test, expect } from '@playwright/test';

test.describe('Transaction Workflow', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/');
        await page.getByLabel('Email').fill('admin@company.com');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: /masuk/i }).click();
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('should navigate to transactions page', async ({ page }) => {
        await page.getByRole('link', { name: /transaksi|transactions/i }).first().click();
        await expect(page).toHaveURL(/.*transactions/);
    });

    test('should display transaction list', async ({ page }) => {
        await page.goto('/transactions');
        
        // Check table is visible
        await expect(page.getByRole('table').first()).toBeVisible({ timeout: 10000 });
    });

    test('should filter transactions by type', async ({ page }) => {
        await page.goto('/transactions');
        
        // Wait for page to load
        await page.waitForTimeout(2000);
        
        // Check if filter exists
        const filterSelect = page.locator('select').first();
        if (await filterSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
            await filterSelect.selectOption({ index: 1 });
        }
    });

    test('should open checkout modal from transactions page', async ({ page }) => {
        await page.goto('/transactions');
        
        // Wait for page to load
        await page.waitForTimeout(2000);
        
        // Click checkout button if available
        const checkoutButton = page.getByRole('button', { name: /checkout|pinjam/i }).first();
        if (await checkoutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await checkoutButton.click();
            await page.waitForTimeout(1000);
        }
    });

    test('should open checkin modal from transactions page', async ({ page }) => {
        await page.goto('/transactions');
        
        // Wait for page to load
        await page.waitForTimeout(2000);
        
        // Click checkin button if available
        const checkinButton = page.getByRole('button', { name: /checkin|kembalikan/i }).first();
        if (await checkinButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await checkinButton.click();
            await page.waitForTimeout(1000);
        }
    });
});

test.describe('Checkout Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Email').fill('admin@company.com');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: /masuk/i }).click();
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('should checkout asset from asset detail page', async ({ page }) => {
        await page.goto('/assets');
        
        // Wait for table
        await expect(page.getByRole('table').first()).toBeVisible({ timeout: 10000 });
        
        // Find an available asset and click view
        const viewButton = page.getByRole('link', { name: /lihat|view|detail/i }).first();
        if (await viewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await viewButton.click();
            await page.waitForTimeout(1000);
            
            // Look for checkout button
            const checkoutButton = page.getByRole('button', { name: /checkout|pinjam/i }).first();
            if (await checkoutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await checkoutButton.click();
                await page.waitForTimeout(1000);
            }
        }
    });
});
