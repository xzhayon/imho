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
    return yield* fx.sync(
      () => this.decoder.decode(u),
      (error) => {
        if (!(error instanceof CodecError)) {
          throw error
        }

        return error
      },
    )
  }
}
