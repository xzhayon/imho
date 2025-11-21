import type { Clock } from '@imho/clock'
import { AbstractLogger } from '../AbstractLogger'
import type { Attributes } from '../Attributes'
import type { Severity } from '../Severity'

export class InMemoryLogger extends AbstractLogger {
  constructor(
    private readonly records: Array<{
      readonly timestamp?: Date
      readonly severity?: Severity
      readonly message?: string
      readonly attributes?: Attributes
      readonly error?: Error
    }>,
    private readonly clock?: Clock,
  ) {
    super()
  }

  protected readonly _log = async (
    severity: Severity,
    message?: string,
    attributes?: Attributes,
    error?: Error,
  ) => {
    this.records.push({
      timestamp: this.clock?.now(),
      severity,
      message,
      attributes,
      error,
    })
  }
}
