import { Log } from '../Log'

export class NullLog implements Log {
  async debug() {}

  async info() {}

  async notice() {}

  async warning() {}

  async error() {}

  async critical() {}

  async alert() {}

  async emergency() {}
}
