import { Response } from '@imho/http'
import { AxiosResponse } from 'axios'

export const fromAxiosResponse = ({
  status,
  headers,
  data,
}: AxiosResponse): Response => ({
  status,
  headers: Object.fromEntries(
    Object.entries(headers).filter(([_, value]) => value !== undefined),
  ),
  body: data,
})
