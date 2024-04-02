export const CodecErrorURI = Symbol()
export class CodecError extends AggregateError {
  readonly [CodecErrorURI]!: typeof CodecErrorURI
  readonly name: string = 'CodecError'
}
