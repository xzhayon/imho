import type { Attributes } from '../Attributes'
import { InMemoryLogger } from '../inMemory/InMemoryLogger'
import type { Severity } from '../Severity'
import { CompositeLogger } from './CompositeLogger'

describe('CompositeLogger', () => {
  const as: Array<{
    readonly timestamp?: Date
    readonly severity?: Severity
    readonly message?: string
    readonly attributes?: Attributes
    readonly error?: Error
  }> = []
  const bs: Array<{
    readonly timestamp?: Date
    readonly severity?: Severity
    readonly message?: string
    readonly attributes?: Attributes
    readonly error?: Error
  }> = []
  const logger = new CompositeLogger([
    new InMemoryLogger(as),
    new InMemoryLogger(bs),
  ])

  test('logging with all loggers', async () => {
    await logger.debug('foo', { foo: 'bar' })
    expect(as.slice(-1).at(0)).toMatchObject({
      severity: 'debug',
      message: 'foo',
      attributes: { foo: 'bar' },
    })
    expect(bs.slice(-1).at(0)).toMatchObject({
      severity: 'debug',
      message: 'foo',
      attributes: { foo: 'bar' },
    })
  })
})
