import { CodecError } from '@nsr/codec'
import * as t from 'io-ts'
import { IoTsCodec } from './IoTsCodec'

describe('IoTsCodec', () => {
  describe('name', () => {
    test.each([
      { type: t.boolean },
      { type: t.array(t.boolean) },
      { type: t.record(t.string, t.number) },
      { type: t.tuple([t.number, t.string]) },
      { type: t.type({ number: t.number, string: t.string }) },
      { type: t.union([t.number, t.string]) },
      {
        type: t.intersection([
          t.type({ boolean: t.boolean, number: t.number }),
          t.type({ number: t.number, string: t.string }),
        ]),
      },
    ])('forwarding codec name ($type.name)', ({ type }: { type: t.Any }) => {
      expect(new IoTsCodec(type).name).toStrictEqual(type.name)
    })
  })

  describe('decode', () => {
    test('failing with a CodecError', () => {
      expect(
        (new IoTsCodec(t.never).decode(undefined) as any).left,
      ).toBeInstanceOf(CodecError)
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
      'forwarding codec result ($type.name)',
      ({ type, input }: { type: t.Any; input: unknown }) => {
        expect((new IoTsCodec(type).decode(input) as any).right).toStrictEqual(
          (type.decode(input) as any).right,
        )
      },
    )
  })
})
