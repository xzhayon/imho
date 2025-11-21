import { AbstractLogger } from '../AbstractLogger'
import type { LogFunction } from '../LogFunction'
import type { Logger } from '../Logger'

export class CompositeLogger extends AbstractLogger {
  constructor(
    private readonly props: { readonly loggers: ReadonlyArray<Logger> },
  ) {
    super()
  }

  readonly log: LogFunction = async (record) => {
    try {
      await Promise.all(this.props.loggers.map((logger) => logger.log(record)))
    } catch {}
  }
}
