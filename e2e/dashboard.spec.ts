import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers';

test.describe('Dashboard Navigation', () => {
    // Helper to login before each test
    test.beforeEach(async ({ page }) => {
        await loginAsStudent(page);
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
