import { Handler } from '@xzhayon/fx'
import { Clock } from './Clock'

export const RawPerformanceClock: Clock = {
  now: () => new Date(performance.timeOrigin + performance.now()),
}

export const FxPerformanceClock = {
  now: RawPerformanceClock.now,
} satisfies Handler<Clock>
