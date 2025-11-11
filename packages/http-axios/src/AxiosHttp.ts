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
import { Axios, isAxiosError } from 'axios'
import { fromAxiosResponse } from './Response'

const source = 'AxiosHttp'

export class AxiosHttp implements Http {
  constructor(
    private readonly axios: Axios,
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

  private async request(
    method: Extract<keyof Http, string>,
    url: Url,
    body?: Body | null,
    options?: Options,
  ) {
    try {
      const startTime = this.clock.now()
      const response = await this.axios.request({
        url: url.toString(),
        method,
        headers: options?.headers,
        params: options?.query,
        data: body,
        signal: options?.abortSignal,
      })
      const endTime = this.clock.now()
      await this.log.debug('HTTP request succeded', {
        url: response.config.url ?? url.toString(),
        method,
        duration: endTime.valueOf() - startTime.valueOf(),
        source,
      })

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
      await this.log.error('HTTP request failed', {
        error,
        url: url.toString(),
        method,
        source,
      })

      throw error
    }
  }
}
