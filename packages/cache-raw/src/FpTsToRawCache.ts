import * as fpTs from '@imho/cache-fp-ts'
import { Decoder, RawToFpTsDecoder } from '@imho/codec-raw'
import { either, taskEither } from 'fp-ts'
import { Cache } from './Cache'

export class FpTsToRawCache implements Cache {
  constructor(private readonly cache: fpTs.Cache) {}

  async has(key: string) {
    const found = await this.cache.has(key)()
    if (either.isLeft(found)) {
      throw found.left
    }

    return found.right
  }

  async get<A>(key: string, decoder: Decoder<A>, onMiss: () => Promise<A>) {
    const a = await this.cache.get(key, new RawToFpTsDecoder(decoder), () =>
      taskEither.tryCatch(onMiss, (cause) =>
        cause instanceof Error
          ? cause
          : new Error('Cannot fetch data', { cause }),
      ),
    )()
    if (either.isLeft(a)) {
      throw a.left
    }

    return a.right
  }

  async delete(key: string) {
    const found = await this.cache.delete(key)()
    if (either.isLeft(found)) {
      throw found.left
    }

    return found.right
  }

  async clear() {
    const cleared = await this.cache.clear()()
    if (either.isLeft(cleared)) {
      throw cleared.left
    }

    return cleared.right
  }
}
