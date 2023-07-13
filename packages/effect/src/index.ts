declare const OptionURI: unique symbol
export interface Option<A> {
  readonly [OptionURI]: typeof OptionURI
}

declare const EitherURI: unique symbol
export interface Either<E, A> {
  readonly [EitherURI]: typeof EitherURI
}

declare const IOURI: unique symbol
export interface IO<A> {
  readonly [IOURI]: typeof IOURI
}

declare const TaskURI: unique symbol
export interface Task<A> {
  readonly [TaskURI]: typeof TaskURI
}
