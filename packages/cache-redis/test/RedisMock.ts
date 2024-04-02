export class RedisMock {
  private ready = false

  constructor(private values: Record<string, string> = {}) {}

  get isReady() {
    return this.ready
  }

  async connect() {
    this.ready = true
  }

  async quit() {
    this.ready = false
  }

  async dbSize() {
    return Object.keys(this.values).length
  }

  async exists(key: string) {
    return key in this.values ? 1 : 0
  }

  async get(key: string) {
    return this.values[key] ?? null
  }

  async set(key: string, value: string) {
    this.values[key] = value
  }

  async del(key: string) {
    if ((await this.exists(key)) === 0) {
      return 0
    }

    delete this.values[key]

    return 1
  }

  async flushDb() {
    this.values = {}
  }
}
