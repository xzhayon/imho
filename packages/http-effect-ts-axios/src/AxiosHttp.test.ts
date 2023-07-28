import { Effect, pipe } from '@effect-ts/core'
import * as Layer from '@effect-ts/core/Effect/Layer'
import { DateClock, HasClock } from '@imho/clock-effect-ts'
import { HttpError, HttpResponseError } from '@imho/http'
import { HasHttp, Http } from '@imho/http-effect-ts'
import { HasLog, VoidLog } from '@imho/log-effect-ts'
import axios from 'axios'
import { AxiosHttp } from './AxiosHttp'

describe('AxiosHttp', () => {
  const layer = pipe(
    Layer.fromEffect(HasHttp)(AxiosHttp(axios)),
    Layer.using(Layer.fromValue(HasClock)(new DateClock())),
    Layer.using(Layer.fromValue(HasLog)(new VoidLog())),
    Layer.main,
  )

  describe('get', () => {
    test('returning `HttpError` on invalid request', async () => {
      const response = Http.get(`foo://bar`)
      await expect(
        pipe(response, Effect.provideLayer(layer), Effect.runPromise),
      ).rejects.toThrow(HttpError)
      await expect(
        pipe(response, Effect.provideLayer(layer), Effect.runPromise),
      ).rejects.not.toThrow(HttpResponseError)
    })
    test('returning `HttpResponseError` on HTTP error', async () => {
      await expect(
        pipe(
          Http.get(`${process.env.NGINX_URL}/404`),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).rejects.toThrow(HttpResponseError)
    })
    test.each([
      ['JSON', 'json', 'application/json', { foo: 'bar' }],
      ['text', 'text', 'text/plain', 'foobar'],
      ['XML', 'xml', 'application/xml', '<foo>bar</foo>'],
    ])('forwarding %s response', async (_type, path, mimeType, body) => {
      await expect(
        pipe(
          Http.get(`${process.env.NGINX_URL}/${path}`),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).resolves.toMatchObject({
        status: 200,
        headers: { 'content-type': mimeType },
        body,
      })
    })
  })
})
