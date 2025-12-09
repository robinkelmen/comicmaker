# ComicMaker Browser Tests

Automated browser testing suite using Puppeteer for end-to-end testing of the ComicMaker application.

## Overview

This test suite validates:
- UI rendering and component presence
- Script parsing and preview generation
- AI settings modal functionality
- Generate button states and interactions
- New comic workflow
- Error handling and warnings

## Prerequisites

1. **Dev server must be running** on `http://localhost:5000`
2. Install dependencies: `npm install`

## Running Tests

### Run all tests once:
```bash
npm test
```

### Watch mode (re-run on changes):
```bash
npm run test:watch
```

### Run tests from parent directory:
```bash
cd web && npm test
```

## Test Structure

```
tests/
├── README.md                 # This file
├── tsconfig.json            # TypeScript config for tests
├── ai-pipeline.test.ts      # Main test suite
└── helpers/
    ├── browser.ts           # Browser automation helpers
    └── logger.ts            # Test logging utilities
```

## Test Coverage

### 1. UI Rendering Test
- Verifies all header buttons are present (New, Load, Save, AI Settings, Generate All)
- Checks editor pane with textarea
- Validates preview pane rendering

### 2. Script Parsing Test
- Tests DSL parsing functionality
- Validates comic title extraction
- Verifies panel generation from script
- Checks correct panel count

### 3. AI Settings Modal Test
- Tests modal open/close behavior
- Validates form elements (provider select, API key input, style input)
- Tests form validation (empty API key)
- Verifies localStorage persistence
- Checks success message display

### 4. Generate Buttons Test
- Verifies Generate buttons appear on each panel
- Checks Generate All button state
- Validates button count matches panel count

### 5. New Comic Flow Test
- Tests New button functionality
- Verifies script reset to example
- Checks success message

### 6. Supabase Warning Test
- Monitors console for Supabase configuration warnings
- Validates error handling when credentials not configured

## Writing New Tests

### Basic Test Structure

```typescript
import { withBrowser } from './helpers/browser'
import { createLogger } from './helpers/logger'

async function testMyFeature() {
  const logger = createLogger('My Feature')

  await withBrowser(async (browser) => {
    logger.info('Starting test')

    await browser.goto('/')
    await browser.click('button')
    await browser.waitForText('Success')

    logger.success('Test passed')
  })
}
```

### Available Browser Helpers

- `goto(path)` - Navigate to URL
- `click(selector)` - Click element
- `type(selector, text)` - Type into input
- `clear(selector)` - Clear input field
- `getText(selector)` - Get element text
- `waitForText(text)` - Wait for text to appear
- `waitForSelector(selector)` - Wait for element
- `screenshot(path)` - Take screenshot
- `evaluate(fn)` - Run code in browser context
- `getLocalStorage(key)` - Get localStorage value
- `setLocalStorage(key, value)` - Set localStorage value

### Logger Methods

- `logger.info(msg)` - Information message
- `logger.success(msg)` - Success message (✅)
- `logger.error(msg)` - Error message (❌)
- `logger.warn(msg)` - Warning message (⚠️)

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Start dev server
  run: cd web && npm run dev &

- name: Wait for server
  run: npx wait-on http://localhost:5000

- name: Run tests
  run: cd web && npm test
```

## Troubleshooting

### Dev server not running
```bash
# Start server in background
cd web && npm run dev &

# Wait for it to be ready
sleep 3

# Run tests
npm test
```

### Puppeteer fails to launch
```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y chromium-browser

# Or use system Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

### Timeouts
- Increase timeout in `browser.ts` helper methods
- Check if dev server is responding: `curl http://localhost:5000`
- Verify network/firewall settings

### Screenshots for debugging
```typescript
await browser.screenshot('debug.png')
```

## Data-Driven Testing Philosophy

This test suite follows a data-driven approach:

1. **State Verification**: Tests verify application state through DOM queries and localStorage
2. **User Flows**: Tests simulate real user interactions end-to-end
3. **Idempotent**: Tests can run multiple times without side effects
4. **Observable**: Comprehensive logging for debugging
5. **Fast Feedback**: Quick test execution for rapid development

## Future Enhancements

- [ ] Mock AI API responses for full pipeline testing
- [ ] Visual regression testing with screenshot comparison
- [ ] Performance metrics (page load, render times)
- [ ] Accessibility testing (ARIA, keyboard navigation)
- [ ] Cross-browser testing (Firefox, Safari, Edge)
- [ ] Test coverage reports
- [ ] Parallel test execution
