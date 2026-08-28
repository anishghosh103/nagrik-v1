import { expect, test } from '@playwright/test';

async function login(
  page: import('@playwright/test').Page,
  persona: 'Rajesh' | 'Ananya',
) {
  const name = persona === 'Rajesh' ? 'Rajesh Kumar' : 'Ananya Sen';
  await page.goto('/');
  await page.getByRole('combobox', { name: /choose a mock account/i }).click();
  await page.getByRole('option', { name: new RegExp(name, 'i') }).click();
  await page.getByRole('button', { name: /send otp/i }).click();
  await page.getByLabel('Six-digit OTP').fill('123456');
  await page.getByRole('button', { name: /enter nagrik/i }).click();
  await expect(
    page.getByRole('heading', { name: /your money tasks/i }),
  ).toBeVisible();
}

test('Rajesh escalates a pre-categorized contribution grievance to resolution', async ({
  page,
}) => {
  await login(page, 'Rajesh');
  await page.goto('/epfo/passbook/issue');
  await expect(
    page.getByRole('heading', { name: /missing-contribution handoff/i }),
  ).toBeVisible();
  await page.getByRole('link', { name: /submit grievance/i }).click();

  await expect(page.getByText(/prefilled from your passbook/i)).toBeVisible();
  await page.getByRole('button', { name: /file this grievance/i }).click();

  await expect(
    page.getByRole('heading', { name: /your grievance was filed/i }),
  ).toBeVisible();
  await page.getByRole('link', { name: /view this grievance/i }).click();

  await expect(page.getByText(/received/i).first()).toBeVisible();
  await page.getByRole('button', { name: /check for updates/i }).click();
  await expect(page.getByText(/in review/i).first()).toBeVisible();
  await page.getByRole('button', { name: /check for updates/i }).click();
  await expect(
    page.getByText(/closed this grievance without changing your record/i),
  ).toBeVisible();

  await page.getByRole('button', { name: /escalate this grievance/i }).click();
  await expect(page.getByText(/escalation has been forwarded/i)).toBeVisible();
  await page.getByRole('button', { name: /check for updates/i }).click();
  await expect(
    page.getByText(/your escalation was reviewed and your record was updated/i),
  ).toBeVisible();

  await page.goto('/epfo/passbook/issue');
  await expect(
    page.getByRole('link', { name: /view grievance/i }),
  ).toBeVisible();
});

test('Ananya files a freeform grievance and it suggests a category', async ({
  page,
}) => {
  await login(page, 'Ananya');
  await page.goto('/grievances');
  await expect(
    page.getByRole('heading', { name: /no grievances filed/i }),
  ).toBeVisible();
  await page.getByRole('link', { name: /file a new grievance/i }).click();

  await page.getByRole('radio', { name: /^income tax$/i }).check();
  await page.getByRole('button', { name: /^continue$/i }).click();

  await page
    .getByPlaceholder(/my may contribution is not showing/i)
    .fill('My Income Tax refund has not been credited yet.');
  await page.getByRole('button', { name: /^continue$/i }).click();

  await expect(
    page.getByRole('radio', { name: /refund not received/i }),
  ).toBeChecked();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await page.getByRole('button', { name: /^continue$/i }).click();

  await page.getByRole('button', { name: /file this grievance/i }).click();
  await expect(
    page.getByRole('heading', { name: /your grievance was filed/i }),
  ).toBeVisible();

  await page.goto('/grievances');
  await expect(page.getByText(/refund not received/i)).toBeVisible();
});
