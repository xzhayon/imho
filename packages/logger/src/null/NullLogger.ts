import { AbstractLogger } from '../AbstractLogger'

export class NullLogger extends AbstractLogger {
  readonly log = async () => {}
}
