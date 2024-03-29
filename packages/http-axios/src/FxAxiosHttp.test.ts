import { Clock, FxDateClock } from '@imho/clock'
import { Http, HttpError, HttpResponseError } from '@imho/http'
import { FxVoidLog, Log } from '@imho/log'
import { layer, perform, run } from '@xzhayon/fx'
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

  const _layer = layer()
    .with(Http, FxAxiosHttp(axios))
    .with(Clock, FxDateClock())
    .with(Log, FxVoidLog())
    .do()

  describe('get', () => {
    test('returning `HttpError` on invalid request', async () => {
      function* f() {
        return yield* perform(Http.get(`foo://bar`))
      }
      const response = run(f(), _layer)

      await expect(response).rejects.toThrow(HttpError)
      await expect(response).rejects.not.toThrow(HttpResponseError)
    })
    test('returning `HttpResponseError` on HTTP error', async () => {
      function* f() {
        return yield* perform(Http.get(`http://foobar/404`))
      }

      await expect(run(f(), _layer)).rejects.toThrow(HttpResponseError)
    })
    test.each([
      ['JSON', 'json', 'application/json', { foo: 'bar' }],
      ['text', 'text', 'text/plain', 'foobar'],
      ['XML', 'xml', 'application/xml', '<foo>bar</foo>'],
    ])('forwarding %s response', async (_type, path, mimeType, body) => {
      function* f() {
        return yield* perform(Http.get(`http://foobar/${path}`))
      }

      await expect(run(f(), _layer)).resolves.toMatchObject({
        status: 200,
        headers: { 'content-type': mimeType },
        body,
      })
    })
  })
})
