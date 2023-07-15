import * as fpTs from '@imho/log-fp-ts'
import { FpTsToRawLog } from './FpTsToRawLog'

export class VoidLog extends FpTsToRawLog {
  constructor() {
    super(new fpTs.VoidLog())
  }
}
