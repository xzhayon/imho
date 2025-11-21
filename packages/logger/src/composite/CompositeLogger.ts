import { AbstractLogger } from '../AbstractLogger'
import type { Attributes } from '../Attributes'
import type { Logger } from '../Logger'
import type { Severity } from '../Severity'

export class CompositeLogger extends AbstractLogger {
  constructor(private readonly loggers: ReadonlyArray<Logger>) {
    super()
  }

  protected readonly _log = async (
    severity: Severity,
    message?: string,
    attributes?: Attributes,
    error?: Error,
  ) => {
    await Promise.all(
      this.loggers.map((logger) =>
        message !== undefined
          ? logger[severity](message, attributes, error)
          : attributes !== undefined
          ? logger[severity](attributes, error)
          : error !== undefined
          ? logger[severity](error)
          : Promise.resolve(),
      ),
    )

    return
  }
}
