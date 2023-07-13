import * as fpTs from '@nsr/cache-fp-ts'
import { Log, RawToFpTsLog } from '@nsr/log-raw'
import { FpTsToRawCache } from './FpTsToRawCache'

export class MapCache extends FpTsToRawCache {
  constructor(log: Log, map = new Map<string, unknown>()) {
    super(fpTs.MapCache(map)(new RawToFpTsLog(log)))
  }
}
