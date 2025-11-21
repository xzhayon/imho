import { InMemoryLogger } from '../inMemory/InMemoryLogger'
import { CompositeLogger } from './CompositeLogger'

describe('CompositeLogger', () => {
  const loggerA = new InMemoryLogger()
  const loggerB = new InMemoryLogger()
  const logger = new CompositeLogger({ loggers: [loggerA, loggerB] })

  test('logging with all loggers', async () => {
    const message = 'foo'
    const attributes = { foo: 'bar' }
    const error = new Error()

    await logger.debug(message, { attributes, error })
    expect(loggerA.records.at(-1)).toMatchObject({ message, attributes, error })
    expect(loggerB.records.at(-1)).toMatchObject({ message, attributes, error })
  })
})
