import { TestBrowser, withBrowser } from './helpers/browser'

describe('Debug Image Generation', () => {
  test('Take screenshots and check console errors', async () => {
    await withBrowser(async (browser: TestBrowser) => {
      await browser.goto('/')

      // Take initial screenshot
      await browser.screenshot('01-initial-load.png')

      // Check for console errors
      const consoleLogs: string[] = []
      const consoleErrors: string[] = []

      browser.page!.on('console', msg => {
        const text = msg.text()
        if (msg.type() === 'error') {
          consoleErrors.push(text)
          console.log('❌ Console Error:', text)
        } else {
          consoleLogs.push(text)
        }
      })

      // Look for the generate button
      const generateButtonExists = await browser.exists('button:has-text("🎨 Generate All")')
      console.log('Generate All button exists:', generateButtonExists)

      const panelGenerateButtonExists = await browser.exists('button:has-text("🎨 Generate Image")')
      console.log('Panel Generate button exists:', panelGenerateButtonExists)

      // Take screenshot of preview area
      await browser.screenshot('02-preview-area.png')

      // Try clicking settings to see if AI key is there
      const settingsButtonExists = await browser.exists('button:has-text("⚙️ AI Settings")')
      console.log('Settings button exists:', settingsButtonExists)

      if (settingsButtonExists) {
        await browser.click('button:has-text("⚙️ AI Settings")')
        await browser.wait(1000)
        await browser.screenshot('03-settings-modal.png')

        // Close modal
        const cancelExists = await browser.exists('button:has-text("Cancel")')
        if (cancelExists) {
          await browser.click('button:has-text("Cancel")')
          await browser.wait(500)
        }
      }

      // Try clicking a panel generate button if it exists
      if (panelGenerateButtonExists) {
        console.log('Clicking panel generate button...')
        await browser.screenshot('04-before-generate.png')
        await browser.click('button:has-text("🎨 Generate Image")')
        await browser.wait(2000)
        await browser.screenshot('05-after-generate-click.png')

        // Wait a bit more to see if anything happens
        await browser.wait(3000)
        await browser.screenshot('06-after-wait.png')
      }

      // Try the generate background button
      const bgButtonExists = await browser.exists('button:has-text("🖼️ Generate Background")')
      console.log('Generate Background button exists:', bgButtonExists)

      if (bgButtonExists) {
        await browser.click('button:has-text("🖼️ Generate Background")')
        await browser.wait(2000)
        await browser.screenshot('07-after-bg-generate.png')
      }

      // Print all console errors at the end
      console.log('\n=== CONSOLE ERRORS ===')
      consoleErrors.forEach(err => console.log(err))
      console.log('\n=== ALL CONSOLE LOGS ===')
      consoleLogs.forEach(log => console.log(log))

      // Check for loading indicators
      const hasSpinner = await browser.exists('.spinner')
      const hasProgressBar = await browser.exists('.progress-bar')
      const hasGenerationStatus = await browser.exists('.generation-status')

      console.log('\nLoading indicators:')
      console.log('- Spinner:', hasSpinner)
      console.log('- Progress bar:', hasProgressBar)
      console.log('- Generation status:', hasGenerationStatus)
    })
  }, 60000)
})
