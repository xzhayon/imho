import { CacheError } from '@nsr/cache'

export const CacheItemNotFoundErrorURI = Symbol()
export class CacheItemNotFoundError extends CacheError {
  private readonly [CacheItemNotFoundErrorURI]!: typeof CacheItemNotFoundErrorURI
  readonly name: string = 'CacheItemNotFoundError'
}
