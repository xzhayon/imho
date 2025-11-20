import type { fx } from 'affex'
import type { Attributes } from './Attributes'
import type { FxLogger } from './Logger'
import type { Severity } from './Severity'

export interface LogFunction {
  (severity: Severity, error: Error): Promise<void>
  (severity: Severity, attributes: Attributes, error?: Error): Promise<void>
  (severity: Severity, message: string, error: Error): Promise<void>
  (
    severity: Severity,
    message: string,
    attributes?: Attributes,
    error?: Error,
  ): Promise<void>
}

export interface LogFunctionWithoutSeverity {
  (error: Error): Promise<void>
  (attributes: Attributes, error?: Error): Promise<void>
  (message: string, error: Error): Promise<void>
  (message: string, attributes?: Attributes, error?: Error): Promise<void>
}

export interface FxLogFunction {
  (severity: Severity, error: Error): fx.Result<void, never>
  (severity: Severity, attributes: Attributes, error?: Error): fx.Result<
    void,
    never
  >
  (severity: Severity, message: string, error: Error): fx.Result<void, never>
  (
    severity: Severity,
    message: string,
    attributes?: Attributes,
    error?: Error,
  ): fx.Result<void, never>
}

export interface FxLogFunctionWithoutSeverity {
  (error: Error): fx.Result<void, never>
  (attributes: Attributes, error?: Error): fx.Result<void, never>
  (message: string, error: Error): fx.Result<void, never>
  (message: string, attributes?: Attributes, error?: Error): fx.Result<
    void,
    never
  >
}

export interface FxLogFunctionWithContext {
  (severity: Severity, error: Error): fx.Effector<void, never, FxLogger>
  (severity: Severity, attributes: Attributes, error?: Error): fx.Effector<
    void,
    never,
    FxLogger
  >
  (severity: Severity, message: string, error: Error): fx.Effector<
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
  (error: Error): fx.Effector<void, never, FxLogger>
  (attributes: Attributes, error?: Error): fx.Effector<void, never, FxLogger>
  (message: string, error: Error): fx.Effector<void, never, FxLogger>
  (message: string, attributes?: Attributes, error?: Error): fx.Effector<
    void,
    never,
    FxLogger
  >
}
