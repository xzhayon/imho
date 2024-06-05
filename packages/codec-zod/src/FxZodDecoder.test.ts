import { CodecError } from '@imho/codec'
import { fx } from 'affex'
import { z } from 'zod'
import { FxZodDecoder } from './FxZodDecoder'

describe('FxZodDecoder', () => {
  describe('decode', () => {
    test('failing with a CodecError', async () => {
      await expect(
        fx.runExit(new FxZodDecoder(z.never()).decode(undefined), fx.context()),
      ).resolves.toMatchObject(
        fx.Exit.failure(fx.Cause.fail({ ...new CodecError([]) })),
      )
    })

    test.each([
      { type: z.boolean(), input: false },
      { type: z.array(z.boolean()), input: [false] },
      { type: z.record(z.string(), z.number()), input: { '': 0 } },
      { type: z.tuple([z.number(), z.string()]), input: [0, ''] },
      {
        type: z.object({ number: z.number(), string: z.string() }),
        input: { number: 0, string: '' },
      },
      { type: z.union([z.number(), z.string()]), input: 0 },
      {
        type: z.intersection(
          z.object({ boolean: z.boolean(), number: z.number() }),
          z.object({ number: z.number(), string: z.string() }),
        ),
        input: { boolean: false, number: 0, string: '' },
      },
    ])(
      'forwarding decoder result ($type.description)',
      async ({ type, input }: { type: z.ZodType<any>; input: unknown }) => {
        await expect(
          fx.runPromise(new FxZodDecoder(type).decode(input), fx.context()),
        ).resolves.toStrictEqual(type.parse(input))
      },
    )
  })
})
