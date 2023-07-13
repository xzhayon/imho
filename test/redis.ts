import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'

export const mapRedis = async <
  M extends RedisModules,
  F extends RedisFunctions,
  S extends RedisScripts,
  A,
>(
  redis: RedisClientType<M, F, S>,
  f: (redis: RedisClientType<M, F, S>) => Promise<A>,
) => {
  if (!redis.isReady) {
    await redis.connect()
  }

  return f(redis)
}
