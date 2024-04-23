import { FxDateClock } from '@imho/clock'
import { Http, HttpError, HttpResponseError } from '@imho/http'
import { FxNullLog } from '@imho/log'
import { fx } from '@xzhayon/fx'
import axios from 'axios'
import nock from 'nock'
import { FxAxiosHttp } from './FxAxiosHttp'

describe('FxAxiosHttp', () => {
  nock('http://foobar')
    .get('/404')
    .reply(404)
    .get('/json')
    .reply(200, JSON.stringify({ foo: 'bar' }), {
      'content-type': 'application/json',
    })
    .get('/text')
    .reply(200, 'foobar', { 'content-type': 'text/plain' })
    .get('/xml')
    .reply(200, '<foo>bar</foo>', { 'content-type': 'application/xml' })

  const layer = fx
    .layer()
    .with(FxAxiosHttp(axios))
    .with(FxDateClock())
    .with(FxNullLog())
    .do()

  describe('get', () => {
    test('returning `HttpError` on invalid request', async () => {
      const response = await fx.runExit(Http.get(`foo://bar`), layer)

      expect(response).toMatchObject(
        fx.Exit.failure(fx.Cause.fail({ ...new HttpError() })),
      )
      expect(response).not.toMatchObject(
        fx.Exit.failure(fx.Cause.fail({ ...new HttpResponseError({} as any) })),
      )
    })

    test('returning `HttpResponseError` on HTTP error', async () => {
      await expect(
        fx.runExit(Http.get(`http://foobar/404`), layer),
      ).resolves.toMatchObject(
        fx.Exit.failure(fx.Cause.fail({ ...new HttpResponseError({} as any) })),
      )
    })

    test.each([
      ['JSON', 'json', 'application/json', { foo: 'bar' }],
      ['text', 'text', 'text/plain', 'foobar'],
      ['XML', 'xml', 'application/xml', '<foo>bar</foo>'],
    ])('forwarding %s response', async (_type, path, mimeType, body) => {
      await expect(
        fx.runPromise(Http.get(`http://foobar/${path}`), layer),
      ).resolves.toMatchObject({
        status: 200,
        headers: { 'content-type': mimeType },
        body,
      })
    })
  })
})
