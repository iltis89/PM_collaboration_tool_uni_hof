import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers';

test.describe('Authentication Flow', () => {
    test('should allow a student to login and redirect to dashboard', async ({ page }) => {
        await loginAsStudent(page);

        // 6. Verify User Identity (optional but good smoke test)
        await expect(page.getByText('Marcus Görner')).toBeVisible();
    });

    test('should protect dashboard routes when not logged in', async ({ page }) => {
        await page.goto('/dashboard');
        // Expect redirect back to login or landing page
        await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('should allow logout', async ({ page }) => {
        await loginAsStudent(page);

        // Click Logout
        await page.getByRole('button', { name: 'Abmelden' }).click();

        // Verify redirect to landing page
        await expect(page).toHaveURL('http://localhost:3000/');

        // Check we can see the login buttons again
        await expect(page.getByRole('button', { name: 'Studenten Login' })).toBeVisible();
    });
});
