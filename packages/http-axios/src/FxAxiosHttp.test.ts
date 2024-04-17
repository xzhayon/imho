import { FxDateClock } from '@imho/clock'
import { Http, HttpError, HttpResponseError } from '@imho/http'
import { FxVoidLog } from '@imho/log'
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
    .with(FxVoidLog())
    .do()

  describe('get', () => {
    test('returning `HttpError` on invalid request', async () => {
      const response = fx.run(Http.get(`foo://bar`), layer)

      await expect(response).rejects.toThrow(HttpError)
      await expect(response).rejects.not.toThrow(HttpResponseError)
    })

    test('returning `HttpResponseError` on HTTP error', async () => {
      await expect(
        fx.run(Http.get(`http://foobar/404`), layer),
      ).rejects.toThrow(HttpResponseError)
    })

    test.each([
      ['JSON', 'json', 'application/json', { foo: 'bar' }],
      ['text', 'text', 'text/plain', 'foobar'],
      ['XML', 'xml', 'application/xml', '<foo>bar</foo>'],
    ])('forwarding %s response', async (_type, path, mimeType, body) => {
      await expect(
        fx.run(Http.get(`http://foobar/${path}`), layer),
      ).resolves.toMatchObject({
        status: 200,
        headers: { 'content-type': mimeType },
        body,
      })
    })
  })
})
