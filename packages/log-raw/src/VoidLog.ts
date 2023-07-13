import * as fpTs from '@nsr/log-fp-ts'
import { FpTsToRawLog } from './FpTsToRawLog'

export class VoidLog extends FpTsToRawLog {
  constructor() {
    super(new fpTs.VoidLog())
  }
}
