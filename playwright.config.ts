import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'on-first-retry' },
  webServer: {
    command: 'pnpm build && pnpm preview --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: true,
  },
  projects: [
    { name: '390px', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: '768px', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 900 } } },
    { name: '1024px', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 900 } } },
    { name: '1440px', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
  ],
})
