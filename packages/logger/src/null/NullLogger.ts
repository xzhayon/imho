import { Logger } from '../Logger'

export class NullLogger implements Logger {
  async debug() {}

  async info() {}

  async notice() {}

  async warning() {}

  async error() {}

  async critical() {}

  async alert() {}

  async emergency() {}
}
