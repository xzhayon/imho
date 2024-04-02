import { Log } from '../Log'

export class VoidLog implements Log {
  async debug() {}

  async info() {}

  async notice() {}

  async warning() {}

  async error() {}

  async critical() {}

  async alert() {}

  async emergency() {}
}
