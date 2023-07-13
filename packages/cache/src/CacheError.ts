export const CacheErrorURI = Symbol()
export class CacheError extends Error {
  private readonly [CacheErrorURI]!: typeof CacheErrorURI
  readonly name: string = 'CacheError'
}
