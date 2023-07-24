export interface Response {
  readonly url: string
  readonly status: number
  readonly headers: Readonly<Record<string, string | ReadonlyArray<string>>>
  readonly body: unknown
}
