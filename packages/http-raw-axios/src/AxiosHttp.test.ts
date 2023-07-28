import { DateClock } from '@imho/clock-raw'
import { HttpError, HttpResponseError } from '@imho/http'
import { VoidLog } from '@imho/log-raw'
import axios from 'axios'
import { AxiosHttp } from './AxiosHttp'

describe('AxiosHttp', () => {
  const http = new AxiosHttp(axios, new DateClock(), new VoidLog())

  describe('get', () => {
    test('throwing `HttpError` on invalid request', async () => {
      const response = http.get(`foo://bar`)
      await expect(response).rejects.toThrow(HttpError)
      await expect(response).rejects.not.toThrow(HttpResponseError)
    })
    test('throwing `HttpResponseError` on HTTP error', async () => {
      await expect(http.get(`${process.env.NGINX_URL}/404`)).rejects.toThrow(
        HttpResponseError,
      )
    })
    test.each([
      ['JSON', 'json', 'application/json', { foo: 'bar' }],
      ['text', 'text', 'text/plain', 'foobar'],
      ['XML', 'xml', 'application/xml', '<foo>bar</foo>'],
    ])('forwarding %s response', async (_type, path, mimeType, body) => {
      await expect(
        http.get(`${process.env.NGINX_URL}/${path}`),
      ).resolves.toMatchObject({
        status: 200,
        headers: { 'content-type': mimeType },
        body,
      })
    })
  })
})
