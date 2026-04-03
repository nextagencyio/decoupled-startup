import { test, expect } from '@playwright/test'

test.describe('Startup Landing Page', () => {
  test('homepage loads with hero section', async ({ page }) => {
    await page.goto('/')
    // Should have a visible h1
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    // Should contain landing page content (not setup guide)
    await expect(page.locator('body')).not.toContainText('Setup Guide')
  })

  test('homepage has paragraph sections', async ({ page }) => {
    await page.goto('/')
    // Should have multiple sections rendered from Drupal paragraphs
    const sections = page.locator('section')
    const count = await sections.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('about/landing pages page loads', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('h1').first()).toBeVisible()
    // Should show "Landing Pages" heading
    await expect(page.locator('h1').first()).toContainText('Landing Pages')
  })

  test('navigation header is present', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('no demo mode banner in non-demo mode', async ({ page }) => {
    await page.goto('/')
    // Demo mode banner should not be visible when NEXT_PUBLIC_DEMO_MODE=false
    const banner = page.locator('text=Demo Mode')
    await expect(banner).toHaveCount(0)
  })
})
