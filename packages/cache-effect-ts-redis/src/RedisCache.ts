import { Effect, Managed, pipe } from '@effect-ts/core'
import { CacheError } from '@nsr/cache'
import { Cache, FpTsToEffectTsCache } from '@nsr/cache-effect-ts'
import * as fpTs from '@nsr/cache-fp-ts-redis'
import { EffectTsToFpTsLog, HasLog, Log } from '@nsr/log-effect-ts'
import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'

const channel = 'RedisCache'

export const RedisCache = <
  M extends RedisModules,
  F extends RedisFunctions,
  S extends RedisScripts,
>(
  redis: RedisClientType<M, F, S>,
) =>
  pipe(
    Effect.accessService(HasLog)(
      (log) =>
        ({
          cache: new (class RedisCache extends FpTsToEffectTsCache {
            constructor(redis: RedisClientType<M, F, S>, log: Log) {
              super(fpTs.RedisCache(redis)(new EffectTsToFpTsLog(log)))
            }
          })(redis, log),
          log,
        } as const),
    ),
    Managed.make(({ log }) =>
      !redis.isReady
        ? Effect.unit
        : pipe(
            Effect.tryCatchPromise(
              () => redis.quit(),
              (cause) =>
                new CacheError('Cannot disconnect from Redis', { cause }),
            ),
            Effect.tapBoth(
              (error) => log.error('Disconnection failed', { channel, error }),
              () => log.debug('Connection closed', { channel }),
            ),
            Effect.orElse(() => Effect.unit),
          ),
    ),
    Managed.map(({ cache }): Cache => cache),
  )
