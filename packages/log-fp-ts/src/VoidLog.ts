import { task } from 'fp-ts'
import { Log } from './Log'

export class VoidLog implements Log {
  debug() {
    return task.of(undefined)
  }

  info() {
    return task.of(undefined)
  }

  notice() {
    return task.of(undefined)
  }

  warning() {
    return task.of(undefined)
  }

  error() {
    return task.of(undefined)
  }

  alert() {
    return task.of(undefined)
  }

  critical() {
    return task.of(undefined)
  }

  emergency() {
    return task.of(undefined)
  }
}
