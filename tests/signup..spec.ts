import { test } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage.js';
import { uniqueEmail } from '../utils/testData.js';

// helper to make a reusable subdomain (7 chars, like your POM)
const genAccount = () => 'qafx' + Math.random().toString(36).slice(2, 6);

let shared = {
  organization: 'QA Fiction Org',
  name: 'Ans Jamil',
  email: uniqueEmail(),         // ← same email for both tests (change if your app forbids duplicate emails)
  country: 'Pakistan',
  accountType: 'School',
  accountName: genAccount(),    // ← same subdomain for both tests
};

// ensure order & isolation (test 2 runs after test 1)
test.describe.serial('Signup flow with duplicate check', () => {

  test('Happy path: submit new signup (first run)', async ({ page }) => {
    const sp = new SignupPage(page);
    await sp.goto();

    // use the SAME values we’ll reuse later
    await sp.fillForm({
      organization: shared.organization,
      name: shared.name,
      email: shared.email,
      country: shared.country,
      accountType: shared.accountType,
      accountName: shared.accountName,   // pass explicit value (not "auto")
    });

    await sp.submitForm();

    // (Optional) If CAPTCHA blocks success, that’s fine. You can assert any success/notice cue here if you like.
    await page.screenshot({ path: 'test-results/happy-first.png', fullPage: false });
  });

  test('Second run with identical details: should show duplicate warning / block', async ({ page }) => {
    const sp = new SignupPage(page);
    await sp.goto();

    // reuse EXACT SAME values
    await sp.fillForm({
      organization: shared.organization,
      name: shared.name,
      email: shared.email,           // if the app blocks duplicate emails first, keep this or switch to uniqueEmail()
      country: shared.country,
      accountType: shared.accountType,
      accountName: shared.accountName,
    });

    // You asked to click submit and then see the error:
     await sp.submitFormExpectingDuplicateToast();

    // After submit, either the toast appears or the page shows a validation block.
    // Prefer the toast you already mapped:
    // await sp.expectAccountNameTaken();

    await page.screenshot({ path: 'test-results/duplicate-second.png', fullPage: false });
  });

});
