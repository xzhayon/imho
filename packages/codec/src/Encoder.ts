export interface Encoder<A, O = A> {
  encode(a: A): O
}
