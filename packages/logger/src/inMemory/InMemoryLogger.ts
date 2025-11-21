import type { Clock } from '@imho/clock'
import { AbstractLogger } from '../AbstractLogger'
import type { LogFunction } from '../LogFunction'
import type { LogRecord } from '../LogRecord'

export class InMemoryLogger extends AbstractLogger {
  constructor(
    private readonly records: Array<LogRecord>,
    private readonly clock?: Clock,
  ) {
    super()
  }

  readonly log: LogFunction = async (record) => {
    this.records.push({
      ...record,
      timestamp: record.timestamp ?? this.clock?.now(),
    })
  }
}
