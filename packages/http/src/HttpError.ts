export const HttpErrorURI = Symbol()
export class HttpError extends Error {
  private readonly [HttpErrorURI]!: typeof HttpErrorURI
  readonly name: string = 'HttpError'
}
