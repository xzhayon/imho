export const CacheErrorUri = Symbol('CacheError')
export class CacheError extends Error {
  readonly [CacheErrorUri]!: typeof CacheErrorUri
  readonly name: string = 'CacheError'
}
