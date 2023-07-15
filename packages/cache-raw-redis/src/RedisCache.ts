import * as fpTs from '@imho/cache-fp-ts-redis'
import { FpTsToRawCache } from '@imho/cache-raw'
import { Log, RawToFpTsLog } from '@imho/log-raw'
import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'

export class RedisCache<
  M extends RedisModules,
  F extends RedisFunctions,
  S extends RedisScripts,
> extends FpTsToRawCache {
  constructor(redis: RedisClientType<M, F, S>, log: Log) {
    super(fpTs.RedisCache(redis)(new RawToFpTsLog(log)))
  }
}
