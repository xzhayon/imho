import { Clock } from '@imho/clock'
import {
  Body,
  Http,
  HttpError,
  HttpResponseError,
  Options,
  Url,
  tag,
} from '@imho/http'
import { Log } from '@imho/log'
import { fx } from 'affex'
import { Axios, isAxiosError } from 'axios'
import { fromAxiosResponse } from './Response'

const source = 'FxAxiosHttp'

export function FxAxiosHttp(axios: Axios) {
  async function* request(
    method: Extract<keyof Http, string>,
    url: Url,
    body?: Body | null,
    options?: Options,
  ) {
    return yield* fx.tryCatch(
      async function* () {
        const startTime = yield* Clock.now()
        const response = yield* fx.async(
          () =>
            axios.request({
              url: url.toString(),
              method,
              headers: options?.headers,
              params: options?.query,
              data: body,
              signal: options?.abortSignal,
            }),
          (cause) =>
            isAxiosError(cause) && cause.response !== undefined
              ? new HttpResponseError(
                  fromAxiosResponse(cause.response),
                  `HTTP ${cause.response.status} ${cause.response.statusText}`,
                  { cause },
                )
              : new HttpError('Cannot get response from server', { cause }),
        )
        const endTime = yield* Clock.now()
        yield* Log.debug('HTTP request succeded', {
          url: response.config.url ?? url.toString(),
          method,
          duration: endTime.valueOf() - startTime.valueOf(),
          source,
        })

        return fromAxiosResponse(response)
      },
      function* (error) {
        yield* Log.error('HTTP request failed', {
          error,
          url: url.toString(),
          method,
          source,
        })

        return yield* fx.raise(error)
      },
    )
  }

  return fx.layer(tag, {
    delete: (url, options) => request('delete', url, null, options),
    get: (url, options) => request('get', url, null, options),
    head: (url, options) => request('head', url, null, options),
    options: (url, options) => request('options', url, null, options),
    patch: (url, body, options) => request('patch', url, body, options),
    post: (url, body, options) => request('post', url, body, options),
    put: (url, body, options) => request('put', url, body, options),
  })
}
