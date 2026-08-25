import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function login(page: import('@playwright/test').Page, persona: 'Rajesh' | 'Ananya') {
  await page.goto('/')
  await page.getByRole('button', { name: /choose a demo citizen/i }).click()
  await page.getByRole('button', { name: persona === 'Rajesh' ? /^RK Rajesh Kumar/i : /^AS Ananya Sen/i }).click()
  await page.getByRole('button', { name: new RegExp(`continue as ${persona}`, 'i') }).click()
  await page.getByRole('button', { name: /send mock otp/i }).click()
  await page.getByLabel('Six-digit OTP').fill('123456')
  await page.getByRole('button', { name: /enter nagrik/i }).click()
}

test('Rajesh corrects identity, submits PF once, and tracks it', async ({ page }) => {
  await login(page, 'Rajesh')
  await expect(page.getByRole('heading', { name: /your money tasks/i })).toBeVisible()
  await page.getByRole('link', { name: /correct your name/i }).click()
  await page.getByRole('button', { name: /review destinations/i }).click()
  await page.getByRole('button', { name: /update connected records/i }).click()
  await expect(page.getByRole('heading', { name: /name is consistent/i })).toBeVisible()
  await page.getByRole('link', { name: /continue to pf claim/i }).click()
  await expect(page.getByText(/7 of 7 checks passed/i)).toBeVisible()
  await page.getByRole('button', { name: /enter claim details/i }).click()
  await page.getByRole('button', { name: /review claim/i }).click()
  await page.getByRole('checkbox').check()
  await page.getByLabel(/mock otp/i).fill('123456')
  await page.getByRole('button', { name: /submit mock pf claim/i }).click()
  await expect(page.getByRole('heading', { name: /pf claim was received/i })).toBeVisible()
  await expect(page.getByText('NGR-PF-260825-1042')).toBeVisible()
  await page.getByRole('link', { name: /view in unified activity/i }).click()
  await expect(page.getByRole('heading', { name: 'PF claim received', exact: true })).toBeVisible()
})

test('Ananya starts healthy without an artificial warning', async ({ page }) => {
  await login(page, 'Ananya')
  await expect(page.getByText(/connected records agree/i)).toBeVisible()
  await expect(page.getByRole('heading', { name: /correct your name/i })).toHaveCount(0)
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')).toEqual([])
})
