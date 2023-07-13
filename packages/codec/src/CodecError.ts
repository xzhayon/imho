export const CodecErrorURI = Symbol()
export class CodecError extends AggregateError {
  private readonly [CodecErrorURI]!: typeof CodecErrorURI
  readonly name: string = 'CodecError'
}
