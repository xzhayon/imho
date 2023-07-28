import { Effect } from '@effect-ts/core'
import { Clock, EffectTsToFpTsClock, HasClock } from '@imho/clock-effect-ts'
import { FpTsToEffectTsHttp, Http } from '@imho/http-effect-ts'
import * as fpTs from '@imho/http-fp-ts-axios'
import { EffectTsToFpTsLog, HasLog, Log } from '@imho/log-effect-ts'
import { Axios } from 'axios'

export const AxiosHttp = (axios: Axios) =>
  Effect.accessServices({ clock: HasClock, log: HasLog })(
    ({ clock, log }): Http =>
      new (class AxiosHttp extends FpTsToEffectTsHttp {
        constructor(axios: Axios, clock: Clock, log: Log) {
          super(
            fpTs.AxiosHttp(axios)({
              clock: new EffectTsToFpTsClock(clock),
              log: new EffectTsToFpTsLog(log),
            }),
          )
        }
      })(axios, clock, log),
  )
