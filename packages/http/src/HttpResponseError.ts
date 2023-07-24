import { HttpError } from './HttpError'
import { Response } from './Response'

export const HttpResponseErrorURI = Symbol()
export class HttpResponseError extends HttpError {
  private readonly [HttpResponseErrorURI]!: typeof HttpResponseErrorURI
  readonly name: string = 'HttpResponseError'

  constructor(
    readonly response: Response,
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options)
  }
}
