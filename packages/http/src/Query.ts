export type Query =
  | Readonly<Record<string, boolean | number | string>>
  | URLSearchParams
