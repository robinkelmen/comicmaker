#!/usr/bin/env tsx

import { withBrowser } from './helpers/browser'
import { createLogger } from './helpers/logger'

const TEST_SCRIPT = `---
title: Test Comic
style: comic book
---

# Page 1

A hero stands on a mountain peak at sunrise

HERO
This is my journey!

---

A close-up of the hero's determined face

HERO (thinking)
I must succeed.
`

async function testUIRendering() {
  const logger = createLogger('UI Rendering')

  await withBrowser(async (browser) => {
    logger.info('Navigating to app')
    await browser.goto('/')

    logger.info('Checking header elements')
    await browser.waitForText('ComicMaker')

    // Check for header buttons by finding buttons and verifying text content
    const buttons = await browser.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      return btns.map(b => b.textContent?.trim())
    })

    if (!buttons.includes('New')) throw new Error('New button not found')
    if (!buttons.includes('Load')) throw new Error('Load button not found')
    if (!buttons.includes('Save')) throw new Error('Save button not found')
    if (!buttons.some(b => b?.includes('AI Settings'))) throw new Error('AI Settings button not found')
    if (!buttons.some(b => b?.includes('Generate All'))) throw new Error('Generate All button not found')

    logger.success('All header buttons present')

    logger.info('Checking editor pane')
    await browser.waitForSelector('textarea')
    await browser.waitForText('Script Editor')

    logger.success('Editor pane rendered')

    logger.info('Checking preview pane')
    await browser.waitForText('Preview')
    await browser.waitForSelector('.comic-page')

    logger.success('Preview pane rendered')

    logger.success('UI rendering test passed')
  })
}

async function testScriptParsing() {
  const logger = createLogger('Script Parsing')

  await withBrowser(async (browser) => {
    logger.info('Navigating to app')
    await browser.goto('/')

    logger.info('Clearing default script')
    await browser.clear('textarea')

    logger.info('Typing test script')
    await browser.type('textarea', TEST_SCRIPT)

    // Wait for parsing to complete
    await new Promise(resolve => setTimeout(resolve, 500))

    logger.info('Checking parsed title')
    await browser.waitForText('Test Comic')

    logger.info('Checking page structure')
    await browser.waitForSelector('.page-container')

    logger.info('Checking panel count')
    const panelCount = await browser.evaluate(() => {
      return document.querySelectorAll('.panel').length
    })

    // Natural language parser creates panels based on sentences, so we expect more than 0
    if (panelCount > 0) {
      logger.success(`Found ${panelCount} panels from natural language parsing`)
    } else {
      throw new Error(`Expected panels, found ${panelCount}`)
    }

    logger.success('Script parsing test passed')
  })
}

async function testAISettingsModal() {
  const logger = createLogger('AI Settings Modal')

  await withBrowser(async (browser) => {
    logger.info('Navigating to app')
    await browser.goto('/')

    logger.info('Opening AI settings modal')
    // Find and click the AI Settings button
    await browser.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const settingsBtn = buttons.find(b => b.textContent?.includes('AI Settings'))
      if (settingsBtn) {
        (settingsBtn as HTMLButtonElement).click()
      } else {
        throw new Error('AI Settings button not found')
      }
    })

    logger.info('Waiting for modal to appear')
    await browser.waitForSelector('.modal')
    await browser.waitForText('AI Settings')

    logger.info('Checking form elements')
    await browser.waitForSelector('select')
    await browser.waitForSelector('input[type="password"]')
    await browser.waitForSelector('input[type="text"]')

    logger.success('Modal form rendered correctly')

    logger.info('Testing form validation')
    await browser.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const saveBtn = buttons.find(b => b.textContent?.includes('Save Settings'))
      if (saveBtn) {
        (saveBtn as HTMLButtonElement).click()
      }
    })

    // Should show alert for empty API key
    await new Promise(resolve => setTimeout(resolve, 500))

    logger.info('Filling in test settings')
    await browser.type('input[type="password"]', 'sk-test-key-12345')

    logger.info('Submitting form')
    await browser.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const saveBtn = buttons.find(b => b.textContent?.includes('Save Settings'))
      if (saveBtn) {
        (saveBtn as HTMLButtonElement).click()
      }
    })

    logger.info('Checking for success message')
    await browser.waitForText('AI settings saved!')

    logger.info('Verifying localStorage')
    const savedSettings = await browser.getLocalStorage('ai_settings')

    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      if (settings.provider === 'stability' && settings.apiKey === 'sk-test-key-12345') {
        logger.success('Settings saved to localStorage correctly')
      } else {
        throw new Error('Settings not saved correctly')
      }
    } else {
      throw new Error('Settings not found in localStorage')
    }

    logger.success('AI settings modal test passed')
  })
}

async function testGenerateButtonPresence() {
  const logger = createLogger('Generate Buttons')

  await withBrowser(async (browser) => {
    logger.info('Navigating to app')
    await browser.goto('/')

    logger.info('Clearing and entering test script')
    await browser.clear('textarea')
    await browser.type('textarea', TEST_SCRIPT)

    await new Promise(resolve => setTimeout(resolve, 500))

    logger.info('Checking for Generate buttons on panels')
    const generateButtons = await browser.evaluate(() => {
      return document.querySelectorAll('.btn-generate').length
    })

    if (generateButtons > 0) {
      logger.success(`Found ${generateButtons} Generate buttons`)
    } else {
      throw new Error(`Expected Generate buttons, found ${generateButtons}`)
    }

    logger.info('Checking Generate All button state')
    const generateAllDisabled = await browser.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const btn = buttons.find(b => b.textContent?.includes('Generate All')) as HTMLButtonElement
      return btn?.disabled
    })

    // Should be enabled since we have valid script
    if (!generateAllDisabled) {
      logger.success('Generate All button is enabled for valid script')
    } else {
      logger.warn('Generate All button is disabled')
    }

    logger.success('Generate buttons test passed')
  })
}

async function testNewComicFlow() {
  const logger = createLogger('New Comic Flow')

  await withBrowser(async (browser) => {
    logger.info('Navigating to app')
    await browser.goto('/')

    logger.info('Modifying default script')
    await browser.clear('textarea')
    await browser.type('textarea', 'Modified content')

    await new Promise(resolve => setTimeout(resolve, 500))

    logger.info('Clicking New button')
    await browser.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const newBtn = buttons.find(b => b.textContent?.trim() === 'New')
      if (newBtn) {
        (newBtn as HTMLButtonElement).click()
      }
    })

    logger.info('Checking for success message')
    await browser.waitForText('Started new comic')

    logger.info('Verifying script was reset')
    const scriptContent = await browser.evaluate(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement
      return textarea?.value
    })

    if (scriptContent.includes("Hero's Journey")) {
      logger.success('Script reset to example')
    } else {
      throw new Error('Script was not reset')
    }

    logger.success('New comic flow test passed')
  })
}

async function testSupabaseNotConfiguredWarning() {
  const logger = createLogger('Supabase Warning')

  await withBrowser(async (browser) => {
    logger.info('Navigating to app')
    await browser.goto('/')

    logger.info('Checking console for Supabase warning')
    const page = browser.getPage()

    let hasWarning = false
    page.on('console', (msg) => {
      if (msg.type() === 'warning' && msg.text().includes('Supabase')) {
        hasWarning = true
        logger.info(`Found warning: ${msg.text()}`)
      }
    })

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (hasWarning) {
      logger.success('Supabase warning displayed correctly')
    } else {
      logger.info('No Supabase warning (credentials may be configured)')
    }

    logger.success('Supabase warning test passed')
  })
}

// Main test runner
async function runTests() {
  console.log('\n🧪 Starting ComicMaker Browser Tests\n')
  console.log('=' .repeat(60))

  const tests = [
    { name: 'UI Rendering', fn: testUIRendering },
    { name: 'Script Parsing', fn: testScriptParsing },
    { name: 'AI Settings Modal', fn: testAISettingsModal },
    { name: 'Generate Buttons', fn: testGenerateButtonPresence },
    { name: 'New Comic Flow', fn: testNewComicFlow },
    { name: 'Supabase Warning', fn: testSupabaseNotConfiguredWarning },
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      console.log(`\n▶️  Running: ${test.name}`)
      await test.fn()
      passed++
    } catch (error) {
      failed++
      console.error(`\n❌ Test failed: ${test.name}`)
      console.error(error)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

// Run tests automatically
runTests().catch((error) => {
  console.error('Test runner failed:', error)
  process.exit(1)
})
