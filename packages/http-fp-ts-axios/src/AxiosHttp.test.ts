import { DateClock } from '@imho/clock-fp-ts'
import { HttpError, HttpResponseError } from '@imho/http'
import { Http } from '@imho/http-fp-ts'
import { VoidLog } from '@imho/log-fp-ts'
import axios from 'axios'
import { either } from 'fp-ts'
import { AxiosHttp } from './AxiosHttp'

describe('AxiosHttp', () => {
  const http = AxiosHttp(axios)({
    clock: new DateClock(),
    log: new VoidLog(),
  })

  describe('get', () => {
    test('returning `HttpError` on invalid request', async () => {
      const error = ((await Http.get(`foo://bar`)(http)()) as any).left
      expect(error).toBeInstanceOf(HttpError)
      expect(error).not.toBeInstanceOf(HttpResponseError)
    })
    test('returning `HttpResponseError` on HTTP error', async () => {
      expect(
        ((await Http.get(`${process.env.NGINX_URL}/404`)(http)()) as any).left,
      ).toBeInstanceOf(HttpResponseError)
    })
    test.each([
      ['JSON', 'json', 'application/json', { foo: 'bar' }],
      ['text', 'text', 'text/plain', 'foobar'],
      ['XML', 'xml', 'application/xml', '<foo>bar</foo>'],
    ])('forwarding %s response', async (_type, path, mimeType, body) => {
      await expect(
        Http.get(`${process.env.NGINX_URL}/${path}`)(http)(),
      ).resolves.toMatchObject(
        either.right({
          status: 200,
          headers: { 'content-type': mimeType },
          body,
        }),
      )
    })
  })
})
