import * as fpTs from '@nsr/cache-fp-ts-redis'
import { FpTsToRawCache } from '@nsr/cache-raw'
import { Log, RawToFpTsLog } from '@nsr/log-raw'
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
