import type { Clock } from '@imho/clock'
import { AbstractLogger } from '../AbstractLogger'
import type { LogFunction } from '../LogFunction'
import type { LogRecord } from '../LogRecord'

export class InMemoryLogger extends AbstractLogger {
  private readonly _records: Array<LogRecord>

  constructor(
    private readonly props?: {
      readonly clock?: Clock
      readonly records?: Array<LogRecord>
    },
  ) {
    super()
    this._records = props?.records ?? []
  }

  get records(): ReadonlyArray<LogRecord> {
    return this._records
  }

  clear(): void {
    this._records.splice(0)
  }

  readonly log: LogFunction = async (record) => {
    this._records.push({
      ...record,
      timestamp: record.timestamp ?? this.props?.clock?.now(),
    })
  }
}
