import { AbstractLogger } from '../AbstractLogger'

export class NullLogger extends AbstractLogger {
  protected readonly _log = async () => {}
}
