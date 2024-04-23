import { CacheError } from '@imho/cache'

export const CacheItemNotFoundErrorUri = Symbol('CacheItemNotFoundError')
export class CacheItemNotFoundError extends CacheError {
  readonly [CacheItemNotFoundErrorUri]!: typeof CacheItemNotFoundErrorUri
  readonly name: string = 'CacheItemNotFoundError'
}
