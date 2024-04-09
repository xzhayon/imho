import { CodecError } from '@imho/codec'
import { z } from 'zod'
import { ZodDecoder } from './ZodDecoder'

describe('ZodDecoder', () => {
  describe('decode', () => {
    test('failing with a CodecError', () => {
      expect(() => new ZodDecoder(z.never()).decode(undefined)).toThrow(
        CodecError,
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
      ({ type, input }: { type: z.ZodType<any>; input: unknown }) => {
        expect(new ZodDecoder(type).decode(input)).toStrictEqual(
          type.parse(input),
        )
      },
    )
  })
})
