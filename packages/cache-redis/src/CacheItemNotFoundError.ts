import { CacheError } from '@imho/cache'

export const CacheItemNotFoundErrorURI = Symbol()
export class CacheItemNotFoundError extends CacheError {
  readonly [CacheItemNotFoundErrorURI]!: typeof CacheItemNotFoundErrorURI
  readonly name: string = 'CacheItemNotFoundError'
}
