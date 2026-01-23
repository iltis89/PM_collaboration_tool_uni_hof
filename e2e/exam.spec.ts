import { test, expect } from '@playwright/test';

test.describe('Exam Preparation Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/');
        await page.getByRole('button', { name: 'Studenten Login' }).click();
        await page.getByPlaceholder('E-Mail Adresse').fill('marcus.goerner@requestchange.eu');
        await page.getByPlaceholder('Passwort').fill('Marcus$2025');
        await page.getByRole('button', { name: 'Anmelden' }).click();
        await expect(page).toHaveURL(/.*\/dashboard/);
    });

    test('should allow starting an exam and answering a question', async ({ page }) => {
        // 1. Navigate to Exam Prep
        await page.getByRole('link', { name: 'Prüfung' }).click();
        await expect(page).toHaveURL(/.*\/exam-prep/);

        // 2. Find and Start an unlocked exam
        // Wait for cards to load
        await expect(page.locator('.glass-card').first()).toBeVisible();

        // Find the first "Starten" button that is enabled
        const startButton = page.getByRole('button', { name: 'Starten' }).first();
        await expect(startButton).toBeEnabled();
        await startButton.click();

        // 3. Verify Exam/Quiz Page Loaded
        await expect(page).toHaveURL(/.*\/exam-prep\/.+/);
        await expect(page.getByText(/Frage \d+ von \d+/)).toBeVisible();

        // 4. Select an Answer (First option)
        // The options are buttons inside the card, ignoring the control buttons at bottom
        // We target the option buttons specifically.
        // Based on the code: options are buttons, not "Auflösen" or "Nächste Frage"
        // We can pick by index relative to the container of options
        // But simplified: pick the first button that isn't the "Auflösen" button.
        // Inspecting the DOM structure from code: Options are rendered before "Auflösen".

        const optionButton = page.locator('.glass-card button').nth(0);
        await optionButton.click();

        // 5. Submit Answer (Auflösen)
        await page.getByRole('button', { name: 'Auflösen' }).click();

        // 6. Verify Feedback
        // "Richtig!" or "Leider falsch." should appear
        await expect(page.getByText(/Richtig!|Leider falsch\./)).toBeVisible();

        // 7. Check if "Nächste Frage" or "Modul abschließen" appears
        await expect(page.getByRole('button', { name: /Nächste Frage|Modul abschließen/ })).toBeVisible();
    });
});
