import { InMemoryLogger } from '../inMemory/InMemoryLogger'
import type { LogRecord } from '../LogRecord'
import { CompositeLogger } from './CompositeLogger'

describe('CompositeLogger', () => {
  const as: Array<LogRecord> = []
  const bs: Array<LogRecord> = []
  const logger = new CompositeLogger([
    new InMemoryLogger(as),
    new InMemoryLogger(bs),
  ])

  test('logging with all loggers', async () => {
    const message = 'foo'
    const attributes = { foo: 'bar' }
    const error = new Error()

    await logger.debug(message, { attributes, error })
    expect(as.slice(-1).at(0)).toMatchObject({ message, attributes, error })
    expect(bs.slice(-1).at(0)).toMatchObject({ message, attributes, error })
  })
})
