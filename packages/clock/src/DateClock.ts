import { Handler } from '@xzhayon/fx'
import { Clock } from './Clock'

export const RawDateClock: Clock = { now: () => new Date() }

export const FxDateClock = { now: RawDateClock.now } satisfies Handler<Clock>
