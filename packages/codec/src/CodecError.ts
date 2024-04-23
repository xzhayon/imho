export const CodecErrorUri = Symbol('CodecError')
export class CodecError extends AggregateError {
  readonly [CodecErrorUri]!: typeof CodecErrorUri
  readonly name: string = 'CodecError'
}
