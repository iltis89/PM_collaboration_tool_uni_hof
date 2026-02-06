import { expect, type Page } from '@playwright/test';

const STUDENT_EMAIL = 'marcus.goerner@requestchange.eu';
const STUDENT_PASSWORD = 'Marcus$2025';

export async function loginAsStudent(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: 'Studenten Login' }).click();
  await page.getByPlaceholder('E-Mail Adresse').fill(STUDENT_EMAIL);
  await page.getByPlaceholder('Passwort').fill(STUDENT_PASSWORD);
  await page.getByRole('button', { name: 'Anmelden' }).click();

  try {
    await page.waitForURL(/.*\/(dashboard|change-password)/, { timeout: 15000 });
  } catch {
    const pageText = await page.locator('main').first().textContent().catch(() => null);
    throw new Error(`Login failed. Current URL: ${page.url()}${pageText ? ` | UI snapshot: ${pageText.slice(0, 180)}` : ''}`);
  }

  // Some seeded users may be forced to change password on first login.
  if (page.url().includes('/change-password')) {
    await page.locator('#password').fill(STUDENT_PASSWORD);
    await page.locator('#confirm').fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: 'Passwort ändern' }).click();
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  }
}
