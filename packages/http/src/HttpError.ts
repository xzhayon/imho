export const HttpErrorURI = Symbol()
export class HttpError extends Error {
  readonly [HttpErrorURI]!: typeof HttpErrorURI
  readonly name: string = 'HttpError'
}
