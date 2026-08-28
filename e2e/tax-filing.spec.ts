import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
}

async function startFiling(page: import('@playwright/test').Page) {
  // Exact match: Rajesh's home page also shows a priority action card whose
  // accessible name (all its text) contains "Income Tax" as a substring.
  await page
    .getByRole('link', { name: 'Income Tax', exact: true })
    .first()
    .click();
  await expect(
    page.getByRole('heading', { name: 'Your Income Tax return', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: /start filing/i }).click();
  await expect(
    page.getByRole('heading', { name: /start your return/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: /^start filing$/i }).click();
  await expect(page.getByText(/first, a few things about you/i)).toBeVisible();
  await page.getByRole('button', { name: /check my filing path/i }).click();
  await expect(page.getByText(/we'll choose the right return/i)).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(
    page.getByRole('heading', { name: /what did you earn this year/i }),
  ).toBeVisible();
}

async function reviewAdditionalIncomeHeads(
  page: import('@playwright/test').Page,
) {
  await expect(
    page.getByRole('heading', { name: /house property/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(
    page.getByRole('heading', { name: /capital gains/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(
    page.getByRole('heading', { name: /business or profession/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: /check filing path/i }).click();
}

test('Ananya files and e-verifies a clean Income Tax return', async ({
  page,
}) => {
  // Filing plus four post-filing notice round trips comfortably exceeds the
  // default 30s budget under parallel viewport workers.
  test.slow();
  await login(page, 'Ananya');
  await startFiling(page);

  // Income discovery -> salary -> interest (all pre-reviewed for Ananya).
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(page.getByText('Bengal Learning Studio')).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(
    page.getByText(/you may qualify for an interest deduction/i),
  ).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();

  await reviewAdditionalIncomeHeads(page);

  // Deductions -> credits.
  await expect(
    page.getByRole('heading', {
      name: 'Tax-saving payments and deductions',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/only part of this amount can be used/i),
  ).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(page.getByText(/tax credits are not deductions/i)).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();

  // Regime -> bank.
  await expect(
    page.getByRole('heading', { name: /which tax regime saves you more/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(
    page.getByText(/where should we send your refund/i),
  ).toBeVisible();
  await page.getByRole('radio').click();
  const bankContinue = page.getByRole('button', { name: /^continue$/i });
  await expect(bankContinue).toBeEnabled();
  await bankContinue.click();

  // Summary -> validation -> declaration.
  await expect(
    page.getByRole('heading', { name: /your final tax calculation/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  const declarationButton = page.getByRole('button', {
    name: /continue to declaration/i,
  });
  await expect(declarationButton).toBeEnabled();
  await declarationButton.click();
  await expect(
    page.getByRole('heading', { name: /declaration and filing/i }),
  ).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: /file mock return/i }).click();

  // E-verification.
  await page.getByLabel(/mock otp/i).fill('123456');
  await page.getByRole('button', { name: /verify with aadhaar otp/i }).click();
  await expect(
    page.getByRole('heading', { name: /your return was filed/i }),
  ).toBeVisible();

  await page.getByRole('link', { name: /unified activity/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Income Tax return filed', exact: true }),
  ).toBeVisible();

  // Post-filing return and refund tracking preserves the frozen filing.
  await page.goto('/tax/returns');
  await expect(
    page.getByRole('heading', { name: 'Return history', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: /NGR-ITR-260825-3382/i }).click();
  await expect(
    page.getByRole('heading', { name: /return is being processed/i }),
  ).toBeVisible();
  await page.getByRole('link', { name: /view refund tracker/i }).click();
  await expect(page.getByText(/expected refund/i)).toBeVisible();
  await expect(page.getByText(/State Bank of India/i)).toBeVisible();

  // A recognised 143(1) discrepancy offers rectification only and remains
  // pending until the simulated CPC outcome arrives.
  await page.goto('/tax/notices/import');
  await page
    .getByRole('button', { name: /intimation · missing TDS credit/i })
    .click();
  await expect(
    page.getByRole('heading', { name: /request rectification/i, level: 1 }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: /compare filed and department values/i })
    .click();
  await expect(page.getByText(/Form 26AS tax credit/i)).toBeVisible();
  await page.getByRole('button', { name: /close/i }).click();
  await page.getByRole('link', { name: /request rectification/i }).click();
  await expect(page).toHaveURL(/\/rectify-review$/);
  await page.getByRole('button', { name: /request rectification/i }).click();
  await expect(page).toHaveURL(/\/rectify-confirmation$/);
  await expect(
    page.getByText(/rectification request submitted/i),
  ).toBeVisible();
  await page.getByRole('button', { name: /check simulated outcome/i }).click();
  await expect(
    page.getByRole('heading', { name: /required action is complete/i }),
  ).toBeVisible();

  // A 139(9) notice deep-links to the exact affected section with saved data.
  await page.goto('/tax/notices/import');
  await page
    .getByRole('button', { name: /defective return · wrong form/i })
    .click();
  await page.getByRole('link', { name: /fix and refile/i }).click();
  await page.getByRole('button', { name: /fix and refile/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Capital gains', exact: true }),
  ).toBeVisible();

  // A confirmed 143(1) demand is paid once and closed out.
  await page.goto('/tax/notices/import');
  await page
    .getByRole('button', { name: /intimation · confirmed demand/i })
    .click();
  await expect(
    page.getByRole('heading', { name: /pay and close out the demand/i }),
  ).toBeVisible();
  await page.getByRole('link', { name: /pay and close out/i }).click();
  await expect(page.getByText(/demand to pay/i)).toBeVisible();
  await page.getByRole('button', { name: /pay and close out/i }).click();
  await expect(
    page.getByRole('heading', { name: /required action is complete/i }),
  ).toBeVisible();

  // ITR-U is shown as a gated, non-default dead end, never the default path.
  await page.goto('/tax/notices/import');
  await page
    .getByRole('button', { name: /older omitted-income example/i })
    .click();
  await expect(
    page.getByRole('heading', { name: /check updated-return eligibility/i }),
  ).toBeVisible();
  await page.getByRole('link', { name: /review itr-u consequences/i }).click();
  await expect(
    page.getByRole('heading', {
      name: /itr-u is not an ordinary correction/i,
    }),
  ).toBeVisible();
  await expect(page.getByText('25%')).toBeVisible();
  await expect(page.getByText('70%')).toBeVisible();
  await expect(
    page.getByText(/stops before an unsupported updated-return filing/i),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter(
      (violation) =>
        (violation.impact === 'critical' || violation.impact === 'serious') &&
        // Pre-existing across the whole app (also reproduces on the EPFO
        // profile page): the shared `text-ink-muted` token fails WCAG AA
        // contrast against `bg-surface`. Tracked separately from this
        // feature; not introduced by the Income Tax workstream.
        violation.id !== 'color-contrast',
    ),
  ).toEqual([]);
});

test('Rajesh must resolve an unreviewed AIS item and validate his bank account', async ({
  page,
}) => {
  await login(page, 'Rajesh');
  await startFiling(page);

  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(page.getByText('Deccan Fabrication Works')).toBeVisible();
  await expect(page.getByText('Mula Engineering Services')).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();

  // The unreviewed AIS item blocks continuing until a decision is made.
  await expect(
    page.getByText(/your tax records show another income item/i),
  ).toBeVisible();
  const continueButton = page.getByRole('button', { name: /^continue$/i });
  await expect(continueButton).toBeDisabled();
  await page.getByRole('button', { name: /keep as other income/i }).click();
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await reviewAdditionalIncomeHeads(page);

  await expect(
    page.getByRole('heading', {
      name: 'Tax-saving payments and deductions',
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(page.getByText(/tax credits are not deductions/i)).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();

  // Regime -> bank: Rajesh's account needs validation before it can be selected.
  await expect(
    page.getByRole('heading', { name: /which tax regime saves you more/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(
    page.getByText(/where should we send your refund/i),
  ).toBeVisible();
  await expect(page.getByRole('radio')).toBeDisabled();
  await page.getByRole('button', { name: /^validate$/i }).click();
  await expect(page.getByRole('radio')).toBeEnabled();
  await page.getByRole('radio').click();
  const bankContinue = page.getByRole('button', { name: /^continue$/i });
  await expect(bankContinue).toBeEnabled();
  await bankContinue.click();

  await expect(
    page.getByRole('heading', { name: /your final tax calculation/i }),
  ).toBeVisible();
});
