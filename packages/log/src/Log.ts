import { Task } from '@imho/effect'
import { Severity } from './Severity'

export type Log = {
  readonly [K in Severity]: (message: string, context?: object) => Task<void>
}
