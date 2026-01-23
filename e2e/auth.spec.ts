import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should allow a student to login and redirect to dashboard', async ({ page }) => {
        // 1. Visit Login Page
        await page.goto('/');

        // 2. Open Student Login Form
        await page.getByRole('button', { name: 'Studenten Login' }).click();
        // await expect(page.getByRole('heading', { name: 'Studenten Login' })).toBeVisible();

        // 3. Fill Credentials (from seed)
        await page.getByPlaceholder('E-Mail Adresse').fill('marcus.goerner@requestchange.eu');
        await page.getByPlaceholder('Passwort').fill('Marcus$2025');

        // 4. Submit
        await page.getByRole('button', { name: 'Anmelden' }).click();

        // 5. Verify Redirect to Dashboard
        await expect(page).toHaveURL(/.*\/dashboard/);

        // 6. Verify User Identity (optional but good smoke test)
        await expect(page.getByText('Marcus Görner')).toBeVisible();
    });

    test('should protect dashboard routes when not logged in', async ({ page }) => {
        await page.goto('/dashboard');
        // Expect redirect back to login or landing page
        await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('should allow logout', async ({ page }) => {
        // Login first
        await page.goto('/');
        await page.getByRole('button', { name: 'Studenten Login' }).click();
        await page.getByPlaceholder('E-Mail Adresse').fill('marcus.goerner@requestchange.eu');
        await page.getByPlaceholder('Passwort').fill('Marcus$2025');
        await page.getByRole('button', { name: 'Anmelden' }).click();
        await expect(page).toHaveURL(/.*\/dashboard/);

        // Click Logout
        await page.getByRole('button', { name: 'Abmelden' }).click();

        // Verify redirect to landing page
        await expect(page).toHaveURL('http://localhost:3000/');

        // Check we can see the login buttons again
        await expect(page.getByRole('button', { name: 'Studenten Login' })).toBeVisible();
    });
});
