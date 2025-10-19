import { expect, Page } from '@playwright/test';

export async function expectAnySuccessCue(page: Page) {
  // Adjust to match actual success pattern (toast/modal/text)
   const header = page.locator('#SignUp1_litSuccess_HeadPanel, h1:has-text("email confirmation has been sent")');
  const panel  = page.locator('div.widget.fluid:has-text("email confirmation has been sent")');

  // try the exact header first
  try {
    await expect(header).toHaveText(/email confirmation has been sent to your address/i, { timeout: 20_000 });
    return;
  } catch (_) {
    // fall back to a broader container match
    await expect(panel).toContainText(/email confirmation has been sent/i, { timeout: 10_000 });
  }
}

export function byFieldError(page: Page, key: string) {
  // Try common error containers near the field
  return page.locator(
    `[data-field="${key}"] .error, #${key}-error, [id$="${key}-error"], .validation-message:has-text("${key}")`
  );
}
