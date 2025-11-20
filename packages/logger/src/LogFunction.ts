import type { fx } from 'affex'
import type { Attributes } from './Attributes'
import type { FxLogger } from './Logger'
import type { Severity } from './Severity'

export interface LogFunction {
  (severity: Severity, attributes: Attributes, error?: Error): Promise<void>
  (
    severity: Severity,
    message: string,
    attributes?: Attributes,
    error?: Error,
  ): Promise<void>
}

export interface LogFunctionWithoutSeverity {
  (attributes: Attributes, error?: Error): Promise<void>
  (message: string, attributes?: Attributes, error?: Error): Promise<void>
}

export interface FxLogFunction {
  (severity: Severity, attributes: Attributes, error?: Error): fx.Result<
    void,
    never
  >
  (
    severity: Severity,
    message: string,
    attributes?: Attributes,
    error?: Error,
  ): fx.Result<void, never>
}

export interface FxLogFunctionWithoutSeverity {
  (attributes: Attributes, error?: Error): fx.Result<void, never>
  (message: string, attributes?: Attributes, error?: Error): fx.Result<
    void,
    never
  >
}

export interface FxLogFunctionWithContext {
  (severity: Severity, attributes: Attributes, error?: Error): fx.Effector<
    void,
    never,
    FxLogger
  >
  (
    severity: Severity,
    message: string,
    attributes?: Attributes,
    error?: Error,
  ): fx.Effector<void, never, FxLogger>
}

export interface FxLogFunctionWithoutSeverityWithContext {
  (attributes: Attributes, error?: Error): fx.Effector<void, never, FxLogger>
  (message: string, attributes?: Attributes, error?: Error): fx.Effector<
    void,
    never,
    FxLogger
  >
}
