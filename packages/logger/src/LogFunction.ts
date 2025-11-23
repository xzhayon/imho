import type { fx } from 'affex'
import type { FxLogger } from './Logger'
import type { LogRecord } from './LogRecord'

export interface LogFunction {
  (record: LogRecord): Promise<void>
}

export interface LogFunctionWithoutSeverity {
  (
    message: string,
    options?: Omit<LogRecord, 'severity' | 'message'>,
  ): Promise<void>
  (error: Error, options?: Omit<LogRecord, 'severity' | 'error'>): Promise<void>
  (record: Omit<LogRecord, 'severity'>): Promise<void>
}

export interface FxLogFunctionWithoutSeverity {
  (
    message: string,
    options?: Omit<LogRecord, 'severity' | 'message'>,
  ): fx.Result<void, never>
  (error: Error, options?: Omit<LogRecord, 'severity' | 'error'>): fx.Result<
    void,
    never
  >
  (record: Omit<LogRecord, 'severity'>): fx.Result<void, never>
}

export interface FxLogFunctionWithoutSeverityWithContext {
  (
    message: string,
    options?: Omit<LogRecord, 'severity' | 'message'>,
  ): fx.Effector<void, never, FxLogger>
  (error: Error, options?: Omit<LogRecord, 'severity' | 'error'>): fx.Effector<
    void,
    never,
    FxLogger
  >
  (record: Omit<LogRecord, 'severity'>): fx.Effector<void, never, FxLogger>
}
