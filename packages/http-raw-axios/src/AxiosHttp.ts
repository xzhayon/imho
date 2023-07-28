import { Clock, RawToFpTsClock } from '@imho/clock-raw'
import * as fpTs from '@imho/http-fp-ts-axios'
import { FpTsToRawHttp } from '@imho/http-raw'
import { Log, RawToFpTsLog } from '@imho/log-raw'
import { Axios } from 'axios'

export class AxiosHttp extends FpTsToRawHttp {
  constructor(axios: Axios, clock: Clock, log: Log) {
    super(
      fpTs.AxiosHttp(axios)({
        clock: new RawToFpTsClock(clock),
        log: new RawToFpTsLog(log),
      }),
    )
  }
}
