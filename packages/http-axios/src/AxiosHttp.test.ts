import { DateClock } from '@imho/clock'
import { HttpError, HttpResponseError } from '@imho/http'
import { NullLogger } from '@imho/logger'
import axios, { CanceledError } from 'axios'
import nock from 'nock'
import { AxiosHttp } from './AxiosHttp'

describe('AxiosHttp', () => {
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

  const http = new AxiosHttp(axios, new DateClock(), new NullLogger())

  describe('get', () => {
    test('returning `HttpError` on invalid request', async () => {
      const response = http.get(`foo://bar`)

      await expect(response).rejects.toThrow(HttpError)
      await expect(response).rejects.not.toThrow(HttpResponseError)
    })

    test('returning `HttpResponseError` on HTTP error', async () => {
      await expect(http.get(`http://foobar/404`)).rejects.toThrow(
        HttpResponseError,
      )
    })

    test.each([
      ['JSON', 'json', 'application/json', { foo: 'bar' }],
      ['text', 'text', 'text/plain', 'foobar'],
      ['XML', 'xml', 'application/xml', '<foo>bar</foo>'],
    ])('forwarding %s response', async (_type, path, mimeType, body) => {
      await expect(http.get(`http://foobar/${path}`)).resolves.toMatchObject({
        status: 200,
        headers: { 'content-type': mimeType },
        body,
      })
    })

    test('aborting request', async () => {
      try {
        await http.get('http://foobar/json', {
          abortSignal: AbortSignal.abort(),
        })
      } catch (error) {
        expect(error).toMatchObject({ cause: new CanceledError() })
      }
    })
  })
})
