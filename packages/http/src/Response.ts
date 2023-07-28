export interface Response {
  readonly status: number
  readonly headers: Readonly<Record<string, string | ReadonlyArray<string>>>
  readonly body: unknown
}
