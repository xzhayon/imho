import { HttpError } from './HttpError'
import { Response } from './Response'

export const HttpResponseErrorUri = Symbol('HttpResponseError')
export class HttpResponseError extends HttpError {
  readonly [HttpResponseErrorUri]!: typeof HttpResponseErrorUri
  readonly name: string = 'HttpResponseError'

  constructor(
    readonly response: Response,
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options)
  }
}
