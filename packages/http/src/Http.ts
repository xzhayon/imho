import { Either, Task } from '@imho/effect'
import { Body } from './Body'
import { HttpError } from './HttpError'
import { Options } from './Options'
import { Response } from './Response'
import { Url } from './Url'

export interface Http {
  delete(url: Url, options?: Options): Task<Either<HttpError, Response>>
  get(url: Url, options?: Options): Task<Either<HttpError, Response>>
  head(url: Url, options?: Options): Task<Either<HttpError, Response>>
  options(url: Url, options?: Options): Task<Either<HttpError, Response>>
  patch(
    url: Url,
    body?: Body,
    options?: Options,
  ): Task<Either<HttpError, Response>>
  post(
    url: Url,
    body?: Body,
    options?: Options,
  ): Task<Either<HttpError, Response>>
  put(
    url: Url,
    body?: Body,
    options?: Options,
  ): Task<Either<HttpError, Response>>
}
