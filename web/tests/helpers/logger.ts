export class TestLogger {
  private testName: string
  private startTime: number

  constructor(testName: string) {
    this.testName = testName
    this.startTime = Date.now()
  }

  log(message: string): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2)
    console.log(`[${elapsed}s] ${this.testName}: ${message}`)
  }

  success(message: string): void {
    this.log(`✅ ${message}`)
  }

  error(message: string): void {
    this.log(`❌ ${message}`)
  }

  warn(message: string): void {
    this.log(`⚠️  ${message}`)
  }

  info(message: string): void {
    this.log(`ℹ️  ${message}`)
  }
}

export function createLogger(testName: string): TestLogger {
  return new TestLogger(testName)
}
