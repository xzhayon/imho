import { Effect } from '@effect-ts/core'
import * as fpTs from '@nsr/cache-fp-ts'
import { EffectTsToFpTsLog, HasLog, Log } from '@nsr/log-effect-ts'
import { Cache } from './Cache'
import { FpTsToEffectTsCache } from './FpTsToEffectTsCache'

export const MapCache = (map = new Map<string, unknown>()) =>
  Effect.accessService(HasLog)(
    (log): Cache =>
      new (class MapCache extends FpTsToEffectTsCache {
        constructor(map: Map<string, unknown>, log: Log) {
          super(fpTs.MapCache(map)(new EffectTsToFpTsLog(log)))
        }
      })(map, log),
  )
