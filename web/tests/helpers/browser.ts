import puppeteer, { Browser, Page } from 'puppeteer'

export class TestBrowser {
  private browser: Browser | null = null
  private page: Page | null = null
  private baseUrl: string

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl
  }

  async launch(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 1920, height: 1080 })
  }

  async goto(path: string = '/'): Promise<void> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.goto(`${this.baseUrl}${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    })
    // Wait a bit for React to hydrate
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  async click(selector: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.waitForSelector(selector, { timeout: 5000 })
    await this.page.click(selector)
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.waitForSelector(selector, { timeout: 5000 })
    await this.page.type(selector, text)
  }

  async clear(selector: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.waitForSelector(selector, { timeout: 5000 })
    await this.page.click(selector, { clickCount: 3 })
    await this.page.keyboard.press('Backspace')
  }

  async getText(selector: string): Promise<string | null> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.waitForSelector(selector, { timeout: 5000 })
    return this.page.$eval(selector, el => el.textContent)
  }

  async waitForText(text: string, timeout: number = 5000): Promise<void> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.waitForFunction(
      (searchText) => document.body.textContent?.includes(searchText),
      { timeout },
      text
    )
  }

  async waitForSelector(selector: string, timeout: number = 5000): Promise<void> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.waitForSelector(selector, { timeout })
  }

  async screenshot(path: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.screenshot({ path, fullPage: true })
  }

  async evaluate<T>(fn: () => T): Promise<T> {
    if (!this.page) throw new Error('Browser not launched')
    return this.page.evaluate(fn)
  }

  async getLocalStorage(key: string): Promise<string | null> {
    if (!this.page) throw new Error('Browser not launched')
    return this.page.evaluate((storageKey) => {
      return localStorage.getItem(storageKey)
    }, key)
  }

  async setLocalStorage(key: string, value: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched')
    await this.page.evaluate((storageKey, storageValue) => {
      localStorage.setItem(storageKey, storageValue)
    }, key, value)
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.page = null
    }
  }

  getPage(): Page {
    if (!this.page) throw new Error('Browser not launched')
    return this.page
  }
}

export async function withBrowser<T>(
  fn: (browser: TestBrowser) => Promise<T>
): Promise<T> {
  const browser = new TestBrowser()
  try {
    await browser.launch()
    return await fn(browser)
  } finally {
    await browser.close()
  }
}
