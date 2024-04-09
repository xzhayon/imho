export interface Decoder<A, I = unknown> {
  decode(i: I): A
}
