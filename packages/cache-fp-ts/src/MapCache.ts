import { CacheError } from '@imho/cache'
import { CodecError } from '@imho/codec'
import { Decoder } from '@imho/codec-fp-ts'
import { Log } from '@imho/log-fp-ts'
import { reader, taskEither } from 'fp-ts'
import { TaskEither } from 'fp-ts/TaskEither'
import { identity, pipe } from 'fp-ts/function'
import { Cache } from './Cache'

const channel = 'MapCache'

export const MapCache = (map = new Map<string, unknown>()) =>
  pipe(
    reader.ask<Log>(),
    reader.map(
      (log): Cache =>
        new (class MapCache implements Cache {
          constructor(
            private readonly map: Map<string, unknown>,
            private readonly log: Log,
          ) {}

          has(key: string) {
            return taskEither.right(this.map.has(key))
          }

          get<E extends Error, A>(
            key: string,
            decoder: Decoder<A>,
            onMiss: () => TaskEither<E, A>,
          ) {
            return pipe(
              this.has(key),
              taskEither.filterOrElse(
                identity,
                () => new CacheError(`Cannot find cache item "${key}"`),
              ),
              taskEither.map(() => this.map.get(key)),
              taskEither.chainEitherKW((u) => decoder.decode(u)),
              taskEither.tapTask(() =>
                this.log.debug('Cache item retrieved', {
                  channel,
                  key,
                }),
              ),
              taskEither.orElseFirstTaskK((error) =>
                error instanceof CodecError
                  ? this.log.error('Cache item decoding failed', {
                      channel,
                      error,
                      key,
                      codec: decoder.name,
                    })
                  : this.log.debug('Cache item not found', {
                      channel,
                      key,
                    }),
              ),
              taskEither.altW(() =>
                pipe(
                  onMiss(),
                  taskEither.tapIO((a) => () => this.map.set(key, a)),
                  taskEither.tapTask(() =>
                    this.log.debug('Cache item refreshed', {
                      channel,
                      key,
                    }),
                  ),
                ),
              ),
            )
          }

          delete(key: string) {
            return pipe(
              taskEither.fromIO(() => this.map.delete(key)),
              taskEither.tapTask((found) =>
                this.log.debug(
                  found
                    ? 'Cache item deleted'
                    : 'Cache item not found for deletion',
                  { channel, key },
                ),
              ),
            )
          }

          clear() {
            return pipe(
              taskEither.fromIO(() => this.map.clear()),
              taskEither.tapTask(() =>
                this.log.debug('Cache cleared', { channel }),
              ),
            )
          }
        })(map, log),
    ),
  )
