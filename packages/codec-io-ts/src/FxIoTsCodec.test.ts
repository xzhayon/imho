import { CodecError } from '@imho/codec'
import { fx } from '@xzhayon/fx'
import * as t from 'io-ts'
import { FxIoTsCodec } from './FxIoTsCodec'

describe('FxIoTsCodec', () => {
  describe('decode', () => {
    test('failing with a CodecError', async () => {
      await expect(
        fx.runExit(new FxIoTsCodec(t.never).decode(undefined), fx.layer()),
      ).resolves.toMatchObject(
        fx.Exit.failure(fx.Cause.fail({ ...new CodecError([]) })),
      )
    })

    test.each([
      { type: t.boolean, input: false },
      { type: t.array(t.boolean), input: [false] },
      { type: t.record(t.string, t.number), input: { '': 0 } },
      { type: t.tuple([t.number, t.string]), input: [0, ''] },
      {
        type: t.type({ number: t.number, string: t.string }),
        input: { number: 0, string: '' },
      },
      { type: t.union([t.number, t.string]), input: 0 },
      {
        type: t.intersection([
          t.type({ boolean: t.boolean, number: t.number }),
          t.type({ number: t.number, string: t.string }),
        ]),
        input: { boolean: false, number: 0, string: '' },
      },
    ])(
      'forwarding decoder result ($type.name)',
      async ({ type, input }: { type: t.Any; input: unknown }) => {
        await expect(
          fx.runPromise(new FxIoTsCodec(type).decode(input), fx.layer()),
        ).resolves.toStrictEqual((type.decode(input) as any).right)
      },
    )
  })
})
