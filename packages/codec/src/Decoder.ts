export interface Decoder<A, I = unknown> {
  readonly name: string
  decode(i: I): A
}
