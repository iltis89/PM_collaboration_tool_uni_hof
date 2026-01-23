import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
    // Helper to login before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Studenten Login' }).click();
        await page.getByPlaceholder('E-Mail Adresse').fill('marcus.goerner@requestchange.eu');
        await page.getByPlaceholder('Passwort').fill('Marcus$2025');
        await page.getByRole('button', { name: 'Anmelden' }).click();
        await expect(page).toHaveURL(/.*\/dashboard/);
    });

    test('should display all sidebar navigation links', async ({ page }) => {
        const links = [
            'Dashboard',
            'Materialien',
            'Audio Learning',
            'Kollaboration',
            'Prüfung'
        ];

        for (const name of links) {
            await expect(page.getByRole('link', { name: name })).toBeVisible();
        }
    });

    test('should navigate to Exam Prep page', async ({ page }) => {
        await page.getByRole('link', { name: 'Prüfung' }).click({ force: true });
        await expect(page).toHaveURL(/.*\/exam-prep/);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('should display user stats in sidebar', async ({ page }) => {
        // Check for Name
        await expect(page.getByText('Marcus Görner')).toBeVisible();

        // Check for Level and XP (partial text match)
        await expect(page.locator('aside').getByText(/Lvl \d+/)).toBeVisible();
        await expect(page.locator('aside').getByText(/XP/)).toBeVisible();
    });
});
