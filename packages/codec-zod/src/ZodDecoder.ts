import { CodecError, Decoder } from '@imho/codec'
import { z } from 'zod'

export class ZodDecoder<A> implements Decoder<A> {
  constructor(private readonly type: z.ZodType<A>) {}

  decode(u: unknown) {
    const a = this.type.safeParse(u)
    if (!a.success) {
      throw new CodecError(
        [],
        `Cannot decode input${
          this.type.description ? ` with codec "${this.type.description}"` : ''
        }`,
        { cause: a.error },
      )
    }

    return a.data
  }
}
