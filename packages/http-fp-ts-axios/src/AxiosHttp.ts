import { Clock } from '@imho/clock-fp-ts'
import {
  Body,
  HttpError,
  HttpResponseError,
  Options,
  Response,
  Url,
} from '@imho/http'
import { Http } from '@imho/http-fp-ts'
import { Log } from '@imho/log-fp-ts'
import { AxiosResponse, AxiosStatic } from 'axios'
import { reader, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { TaskEither } from 'fp-ts/lib/TaskEither'

const channel = 'AxiosHttp'

export const AxiosHttp = (axios: AxiosStatic) =>
  pipe(
    reader.ask<{ clock: Clock; log: Log }>(),
    reader.map(
      ({ clock, log }): Http =>
        new (class AxiosHttp implements Http {
          constructor(
            private readonly axios: AxiosStatic,
            private readonly clock: Clock,
            private readonly log: Log,
          ) {}

          delete(url: Url, options?: Options) {
            return this.request('delete', url, null, options)
          }

          get(url: Url, options?: Options) {
            return this.request('get', url, null, options)
          }

          head(url: Url, options?: Options) {
            return this.request('head', url, null, options)
          }

          options(url: Url, options?: Options) {
            return this.request('options', url, null, options)
          }

          patch(url: Url, body?: Body | null, options?: Options) {
            return this.request('patch', url, body, options)
          }

          post(url: Url, body?: Body | null, options?: Options) {
            return this.request('post', url, body, options)
          }

          put(url: Url, body?: Body | null, options?: Options) {
            return this.request('put', url, body, options)
          }

          private request(
            method: keyof Http,
            url: Url,
            body?: Body | null,
            options?: Options,
          ): TaskEither<HttpError, Response> {
            return pipe(
              taskEither.Do,
              taskEither.bind('startTime', () =>
                taskEither.fromIO(this.clock.now()),
              ),
              taskEither.bind('response', () =>
                taskEither.tryCatch(
                  () =>
                    this.axios.request({
                      url: url.toString(),
                      method,
                      headers: options?.headers,
                      params: options?.query,
                      data: body,
                    }),
                  (cause) =>
                    axios.isAxiosError(cause) && cause.response !== undefined
                      ? new HttpResponseError(response(cause.response), '', {
                          cause,
                        })
                      : new HttpError('', { cause }),
                ),
              ),
              taskEither.bind('endTime', () =>
                taskEither.fromIO(this.clock.now()),
              ),
              taskEither.tapTask(({ response, startTime, endTime }) =>
                this.log.debug('HTTP request succeded', {
                  channel,
                  url: response.config.url ?? url.toString(),
                  method,
                  duration: endTime - startTime,
                }),
              ),
              taskEither.orElseFirstTaskK((error) =>
                this.log.error('HTTP request failed', {
                  channel,
                  error,
                  url: url.toString(),
                  method,
                }),
              ),
              taskEither.map(({ response }) => response),
              taskEither.map(response),
            )
          }
        })(axios, clock, log),
    ),
  )

const response = ({ status, headers, data }: AxiosResponse): Response => ({
  status,
  headers: Object.fromEntries(
    Object.entries(headers).filter(([_, value]) => value !== undefined),
  ),
  body: data,
})
