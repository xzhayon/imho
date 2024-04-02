import { Clock } from '@imho/clock'
import {
  Body,
  Http,
  HttpError,
  HttpResponseError,
  Options,
  Url,
} from '@imho/http'
import { Log } from '@imho/log'
import { Handler, perform } from '@xzhayon/fx'
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
    try {
      const startTime = yield* perform(Clock.now())
      const response = await axios.request({
        url: url.toString(),
        method,
        headers: options?.headers,
        params: options?.query,
        data: body,
      })
      const endTime = yield* perform(Clock.now())
      yield* perform(
        Log.debug('HTTP request succeded', {
          url: response.config.url ?? url.toString(),
          method,
          duration: endTime.valueOf() - startTime.valueOf(),
          source,
        }),
      )

      return fromAxiosResponse(response)
    } catch (cause) {
      const error =
        isAxiosError(cause) && cause.response !== undefined
          ? new HttpResponseError(
              fromAxiosResponse(cause.response),
              `HTTP ${cause.response.status} ${cause.response.statusText}`,
              { cause },
            )
          : new HttpError('Cannot get response from server', { cause })
      yield* perform(
        Log.error('HTTP request failed', {
          error,
          url: url.toString(),
          method,
          source,
        }),
      )

      throw error
    }
  }

  return {
    delete: (url, options) => request('delete', url, null, options),
    get: (url, options) => request('get', url, null, options),
    head: (url, options) => request('head', url, null, options),
    options: (url, options) => request('options', url, null, options),
    patch: (url, body, options) => request('patch', url, body, options),
    post: (url, body, options) => request('post', url, body, options),
    put: (url, body, options) => request('put', url, body, options),
  } satisfies Handler<Http>
}
