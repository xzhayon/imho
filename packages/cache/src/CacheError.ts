export const CacheErrorURI = Symbol()
export class CacheError extends Error {
  readonly [CacheErrorURI]!: typeof CacheErrorURI
  readonly name: string = 'CacheError'
}
