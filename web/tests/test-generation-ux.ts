#!/usr/bin/env tsx

import puppeteer, { Browser, Page } from 'puppeteer'
import path from 'path'
import fs from 'fs'

const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots')
const DEV_URL = 'http://localhost:5000'

async function main() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  }

  console.log('🚀 Launching browser...')
  const browser: Browser = await puppeteer.launch({
    headless: false, // Show the browser so we can see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true // Open DevTools automatically
  })

  const page: Page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  // Capture console messages
  const consoleLogs: Array<{type: string, text: string}> = []
  page.on('console', msg => {
    const logEntry = {
      type: msg.type(),
      text: msg.text()
    }
    consoleLogs.push(logEntry)
    console.log(`📝 [${msg.type()}]`, msg.text())
  })

  // Capture network errors
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`❌ Network Error: ${response.status()} ${response.url()}`)
    }
  })

  try {
    console.log(`📍 Navigating to ${DEV_URL}...`)
    await page.goto(DEV_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    })

    await new Promise(resolve => setTimeout(resolve, 1000))
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-initial-load.png'), fullPage: true })
    console.log('✅ Initial load screenshot taken')

    // Check if generate buttons exist
    const generateButtons = await page.$$('button:has-text("🎨 Generate Image")')
    console.log(`🔍 Found ${generateButtons.length} panel generate buttons`)

    const generateAllButton = await page.$('button:has-text("🎨 Generate All")')
    console.log(`🔍 Generate All button exists:`, !!generateAllButton)

    const generateBgButton = await page.$('button:has-text("🖼️ Generate Background")')
    console.log(`🔍 Generate Background button exists:`, !!generateBgButton)

    // Try clicking a single panel generate button
    if (generateButtons.length > 0) {
      console.log('\n🖱️  Clicking first panel generate button...')
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-before-click.png'), fullPage: true })

      await generateButtons[0].click()
      console.log('⏳ Waiting for response...')

      await new Promise(resolve => setTimeout(resolve, 2000))
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-after-click-2s.png'), fullPage: true })

      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-after-click-5s.png'), fullPage: true })

      // Check for loading indicators
      const hasSpinner = await page.$('.spinner')
      const hasProgressBar = await page.$('.progress-bar')
      const hasMessage = await page.$('.message')

      console.log('\n📊 UI State after clicking:')
      console.log('  - Spinner visible:', !!hasSpinner)
      console.log('  - Progress bar visible:', !!hasProgressBar)
      console.log('  - Message visible:', !!hasMessage)

      if (hasMessage) {
        const messageText = await page.$eval('.message', el => el.textContent)
        console.log('  - Message text:', messageText)
      }
    }

    // Check AI settings
    console.log('\n⚙️  Checking AI Settings...')
    const settingsButton = await page.$('button:has-text("⚙️ AI Settings")')
    if (settingsButton) {
      await settingsButton.click()
      await new Promise(resolve => setTimeout(resolve, 1000))
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-settings-modal.png'), fullPage: true })

      // Check if API key exists in local storage
      const hasApiKey = await page.evaluate(() => {
        const settings = localStorage.getItem('ai_settings')
        if (settings) {
          const parsed = JSON.parse(settings)
          return {
            hasKey: !!parsed.apiKey,
            provider: parsed.provider,
            keyLength: parsed.apiKey?.length || 0
          }
        }
        return { hasKey: false }
      })
      console.log('  - AI Settings in localStorage:', hasApiKey)
    }

    console.log('\n\n=== CONSOLE LOG SUMMARY ===')
    const errors = consoleLogs.filter(l => l.type === 'error')
    const warnings = consoleLogs.filter(l => l.type === 'warning')

    if (errors.length > 0) {
      console.log(`\n❌ ${errors.length} Console Errors:`)
      errors.forEach(e => console.log('  -', e.text))
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️  ${warnings.length} Console Warnings:`)
      warnings.forEach(w => console.log('  -', w.text))
    }

    console.log('\n✅ Screenshots saved to:', SCREENSHOT_DIR)
    console.log('\n⏸️  Browser left open for manual inspection. Press Ctrl+C to close.')

    // Keep browser open for manual inspection
    await new Promise(() => {}) // Never resolves

  } catch (error) {
    console.error('❌ Test failed:', error)
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error.png'), fullPage: true })
    await browser.close()
    process.exit(1)
  }
}

main()
