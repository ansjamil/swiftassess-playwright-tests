import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
  readonly page: Page;

  // Top-of-form fields
  readonly organization: Locator;
  readonly name: Locator;
  readonly email: Locator;

  // Selects
  readonly country: Locator;
  readonly accountType: Locator;

  // Account name (subdomain) before ".swiftassess.com"
  readonly accountName: Locator;
    readonly toast: Locator;

  // CAPTCHA (detect only)
//   readonly captcha: Locator;

  // Submit button
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;

    // Prefer stable IDs, then fallbacks
    this.organization = page.locator('#SignUp1_txtOrganization')
      .or(page.locator('input[name="SignUp1$txtOrganization"]'))
      .or(page.getByPlaceholder(/organ/i));

    this.name = page.locator('#SignUp1_txtName')
      .or(page.locator('input[name="SignUp1$txtName"]'))
      .or(page.getByPlaceholder(/^name$/i));

    this.email = page.locator('#SignUp1_txtEmail')
      .or(page.locator('input[name="SignUp1$txtEmail"]'))
      .or(page.locator('input[type="email"]'));

    // Selects (IDs first, then role and attribute fallbacks)
    this.country = page.locator('#SignUp1_ddlCountry')
      .or(page.getByRole('combobox', { name: /country/i }))
      .or(page.locator('select[id*="ddlCountry"], select[name*="ddlCountry"], select[name="Country"]'));

    this.accountType = page.locator('#SignUp1_ddlAccountType')
      .or(page.getByRole('combobox', { name: /account\s*type/i }))
      .or(page.locator('select[id*="ddlAccountType"], select[name*="ddlAccountType"], select[name="AccountType"]'));

    // The left input before ".swiftassess.com"
    this.accountName = page.locator('#SignUp1_txtAccountURL')
      .or(page.locator('input[name*="AccountName"]'))
      .or(page.getByPlaceholder(/account name/i))
      .first();

        this.toast = page.locator('#toastBox .notification.warning .inner');

    // CAPTCHA detector (we won’t solve it)
    // this.captcha = page.locator('img[src*="captcha"], canvas[aria-label*="captcha" i], [id*="captcha" i]');

    // Submit button variants
   // Submit (anchor-first, then safe fallbacks)
this.submit = page.locator(
  [
    '#SignUp1_btnSignUp'                // exact id (anchor)
    // '[id="SignUp1_btnSignUp"]',           // any element with that id
    // '[id*="btnSignUp"]',                  // id contains
    // 'a:has-text("Sign Up")',              // anchor by text
    // 'button:has-text("Sign Up")',         // button fallback
    // 'input[type="submit"]',               // input fallback
    // '#SignUp1_btnSubmit'                  // other id you had
  ].join(', ')
).first();

  }

  async goto() {
    await this.page.goto('/Signup', { waitUntil: 'domcontentloaded' });
    // Assert ONE element only to satisfy strict mode
    await expect(this.organization).toBeVisible({ timeout: 10_000 });
  }

  private genAccount(): string {
    const syllables = [
      "ja","mi","ro","le","xi","an","no","va","ra","so","ta",
      "ke","li","on","pa","mo","ze","da","fi","ha","ko","te"
    ];
    const randomName =
      syllables[Math.floor(Math.random() * syllables.length)] +
      syllables[Math.floor(Math.random() * syllables.length)] +
      syllables[Math.floor(Math.random() * syllables.length)];
    return randomName.slice(0, 7).toLowerCase();
  }

  async fillForm(data: {
    organization: string;
    name: string;
    email: string;
    country?: string;      // visible text (e.g., "Afghanistan")
    accountType?: string;  // visible text (e.g., "School")
    accountName?: string;  // subdomain (e.g., "qa123")
  }) {
    await this.organization.fill(data.organization);
    await this.name.fill(data.name);
    await this.email.fill(data.email);

    if (data.country) {
      const label = data.country;
      await this.country.selectOption({ label }).catch(async () => {
        await this.country.click();
        await this.page.keyboard.type(label);
        await this.page.keyboard.press('Enter');
      });
    }

    if (data.accountType) {
      const label = data.accountType;
      await this.accountType.selectOption({ label }).catch(async () => {
        await this.accountType.click();
        await this.page.keyboard.type(label);
        await this.page.keyboard.press('Enter');
      });
    }

  if (data.accountName) {
      // “auto” → random; anything else → exact
      const accountValue = data.accountName === 'auto'
        ? this.genAccount()
        : data.accountName;

      // Focus, clear, fill
      await this.accountName.click({ clickCount: 3 });
      await this.page.keyboard.press('Backspace');
      await this.accountName.fill(accountValue);

      // blur to trigger duplicate check
      await this.name.focus();

      console.log(`Filled Account Name: ${accountValue}`);
    }
  }
async expectAccountNameTaken() {
  // match both variants: duplicate email OR duplicate account name
  const toast = this.page
    .locator('#toastBox .notification.warning .inner')
    .filter({ hasText: /(account registered with this email|belongs to another account)/i });

  // wait until it actually appears (prevents race with fading)
  await toast.waitFor({ state: 'visible', timeout: 20_000 });

  await expect(toast).toBeVisible();
  await expect(toast).toContainText(/(account registered with this email|belongs to another account)/i);

  console.log('⚠️ Duplicate email/account toast verified.');
}


 async submitForm() {
  const btn = this.submit.first();

  // 1) Make sure the element exists in the DOM
  await btn.waitFor({ state: 'attached', timeout: 10_000 });

  // 2) Scroll into view
  const handle = await btn.elementHandle();
  if (handle) {
    await this.page.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), handle).catch(() => {});
  }

  // 3) Scroll if not visible
  for (let i = 0; i < 8; i++) {
    if (await btn.isVisible()) break;
    await this.page.mouse.wheel(0, 900);
    await this.page.waitForTimeout(200);
  }

  // 4) Jump to bottom if still hidden
  if (!(await btn.isVisible()).valueOf()) {
    await this.page.keyboard.press('End');
    await this.page.waitForTimeout(300);
  }

  // 5) Click the button
  await expect(btn).toBeVisible({ timeout: 5_000 });
  await expect(btn).toBeEnabled({ timeout: 5_000 });
  try {
    await btn.click({ timeout: 5_000 });
  } catch {
    await btn.click({ force: true, timeout: 5_000 });
  }

  // 6) Wait for success message to appear
  const successMessage = this.page.locator('#SignUp1_litSuccess_HeadPanel');
  await successMessage.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {
    console.warn('Success message did not appear within 15s.');
  });

  // 7) Scroll up to the top for visibility
  await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 8) Wait a few seconds after success message (for screenshots or stability)
  await this.page.waitForTimeout(3000);

  console.log('✅ Signup form submitted and success message confirmed.');
}


async submitFormExpectingDuplicateToast() {
  const btn = this.submit.first();
  const toast = this.page
    .locator('#toastBox .notification.warning .inner')
    .filter({ hasText: /(There is an account registerd with this email previously. Try with another email.)/i });

  // ensure button is interactable
  await btn.waitFor({ state: 'attached', timeout: 10_000 });
  await btn.scrollIntoViewIfNeeded();
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();

  // click and wait for toast at the same time (prevents missing short-lived toast)
  await Promise.all([
    toast.waitFor({ state: 'visible', timeout: 15_000 }),
    btn.click({ force: true })
  ]);

  // optional: extra check
  await expect(toast).toBeVisible();
}


}
