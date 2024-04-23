export const HttpErrorUri = Symbol('HttpError')
export class HttpError extends Error {
  readonly [HttpErrorUri]!: typeof HttpErrorUri
  readonly name: string = 'HttpError'
}
