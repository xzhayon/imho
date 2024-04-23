import { CodecError, Decoder, FxDecoder } from '@imho/codec'
import { fx } from '@xzhayon/fx'
import { z } from 'zod'
import { ZodDecoder } from './ZodDecoder'

export class FxZodDecoder<A> implements FxDecoder<A> {
  private readonly decoder: Decoder<A>

  constructor(type: z.ZodType<A>) {
    this.decoder = new ZodDecoder(type)
  }

  *decode(u: unknown) {
    try {
      return this.decoder.decode(u)
    } catch (error) {
      if (!(error instanceof CodecError)) {
        throw error
      }

      return yield* fx.raise(error)
    }
  }
}
