import { CacheError } from '@nsr/cache'
import { Cache } from '@nsr/cache-fp-ts'
import { CodecError } from '@nsr/codec'
import { Decoder } from '@nsr/codec-fp-ts'
import { IoTsCodec } from '@nsr/codec-fp-ts-io-ts'
import { Log } from '@nsr/log-fp-ts'
import {
  RedisClientType,
  RedisFlushModes,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'
import { reader, task, taskEither } from 'fp-ts'
import { TaskEither } from 'fp-ts/TaskEither'
import { identity, pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import { CacheItemNotFoundError } from './CacheItemNotFoundError'

const channel = 'RedisCache'

export const RedisCache = <
  M extends RedisModules,
  F extends RedisFunctions,
  S extends RedisScripts,
>(
  redis: RedisClientType<M, F, S>,
) =>
  pipe(
    reader.ask<Log>(),
    reader.map(
      (log): Cache =>
        new (class RedisCache implements Cache {
          constructor(
            private readonly redis: RedisClientType<M, F, S>,
            private readonly log: Log,
          ) {}

          has(key: string) {
            return pipe(
              this.connect(),
              taskEither.chain(() =>
                taskEither.tryCatch(
                  async () => (await this.redis.exists(key)) === 1,
                  (cause) =>
                    new CacheError(`Cannot check for item "${key}" on Redis`, {
                      cause,
                    }),
                ),
              ),
              taskEither.orElseFirstTaskK((error) =>
                this.log.error('Cache item not found', {
                  channel,
                  error,
                  key,
                }),
              ),
            )
          }

          get<E extends Error, A>(
            key: string,
            decoder: Decoder<A>,
            onMiss: () => TaskEither<E, A>,
          ) {
            return pipe(
              this.has(key),
              taskEither.filterOrElseW(
                identity,
                () =>
                  new CacheItemNotFoundError(`Cannot find cache item "${key}"`),
              ),
              taskEither.chain(() =>
                taskEither.tryCatch(
                  () => this.redis.get(key),
                  (cause) =>
                    new CacheError(`Cannot get item "${key}" from Redis`, {
                      cause,
                    }),
                ),
              ),
              taskEither.chainEitherKW((u) =>
                new IoTsCodec(t.string.pipe(tt.JsonFromString)).decode(u),
              ),
              taskEither.chainEitherKW((json) => decoder.decode(json)),
              taskEither.tapTask(() =>
                this.log.debug('Cache item retrieved', { channel, key }),
              ),
              taskEither.orElseFirstTaskK((error) =>
                error instanceof CacheItemNotFoundError
                  ? this.log.debug('Cache item not found', { channel, key })
                  : error instanceof CodecError
                  ? this.log.error('Cache item decoding failed', {
                      channel,
                      error,
                      key,
                      codec: decoder.name,
                    })
                  : this.log.error('Cache item not found', {
                      channel,
                      error,
                      key,
                    }),
              ),
              taskEither.altW(() =>
                pipe(
                  onMiss(),
                  taskEither.tap((a) =>
                    taskEither.tryCatch(
                      () => this.redis.set(key, JSON.stringify(a)),
                      (cause) =>
                        new CacheError(`Cannot save item "${key}" to Redis`, {
                          cause,
                        }),
                    ),
                  ),
                  taskEither.tapTask(() =>
                    this.log.debug('Cache item refreshed', { channel, key }),
                  ),
                  taskEither.orElseFirstTaskK((error) =>
                    error instanceof CacheError
                      ? this.log.error('Cache item not saved', {
                          channel,
                          error,
                          key,
                        })
                      : task.of(undefined),
                  ),
                ),
              ),
            )
          }

          delete(key: string) {
            return pipe(
              this.connect(),
              taskEither.chain(() =>
                taskEither.tryCatch(
                  async () => (await this.redis.del(key)) === 1,
                  (cause) =>
                    new CacheError(`Cannot delete item "${key}" from Redis`, {
                      cause,
                    }),
                ),
              ),
              taskEither.tapTask((found) =>
                this.log.debug(
                  found
                    ? 'Cache item deleted'
                    : 'Cache item not found for deletion',
                  { channel, key },
                ),
              ),
              taskEither.orElseFirstTaskK((error) =>
                this.log.error('Cache item not deleted', {
                  channel,
                  error,
                  key,
                }),
              ),
            )
          }

          clear() {
            return pipe(
              this.connect(),
              taskEither.chain(() =>
                taskEither.tryCatch(
                  async () => this.redis.flushDb(RedisFlushModes.ASYNC),
                  (cause) =>
                    new CacheError('Cannot flush Redis database', { cause }),
                ),
              ),
              taskEither.asUnit,
              taskEither.tapTask(() =>
                this.log.debug('Cache cleared', { channel }),
              ),
              taskEither.orElseFirstTaskK((error) =>
                this.log.error('Cache not cleared', { channel, error }),
              ),
            )
          }

          private connect() {
            return this.redis.isReady
              ? taskEither.of(undefined)
              : pipe(
                  taskEither.tryCatch(
                    () => this.redis.connect(),
                    (cause) =>
                      new CacheError('Cannot connect to Redis', { cause }),
                  ),
                  taskEither.tapTask(() =>
                    this.log.debug('Connection opened', { channel }),
                  ),
                  taskEither.orElseFirstTaskK((error) =>
                    this.log.error('Connection failed', { channel, error }),
                  ),
                )
          }
        })(redis, log),
    ),
  )
