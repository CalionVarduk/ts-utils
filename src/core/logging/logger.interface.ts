import { LogType } from './log-type.enum';
import { LogMessage } from './log-message';
import { IDisposable } from '../disposable.interface';

/** Represents a logger delegate type. */
export type LoggerDelegate =
    (message: LogMessage, timestamp: number, logger: ILogger) => void;

/** Represents a logger listener. */
export interface ILoggerListener
    extends
    IDisposable
{
    /** Specifies whether or not the event listener has been disposed. */
    readonly isDisposed: boolean;

    /** Specifies a delegate associated with the logger listener. */
    readonly delegate: LoggerDelegate;
}

/** Represents a logger that can be listened to. */
export interface ILogger
    extends
    IDisposable
{
    /** Specifies all listeners attached to the event. */
    readonly listeners: ReadonlyArray<ILoggerListener>;

    /** Specifies whether or not the event has been disposed. */
    readonly isDisposed: boolean;

    /** Specifies logger's current timestamp. */
    readonly timestamp: number;

    /** Specifies logger's current log level. */
    logLevel: LogType;

    /**
     * Publishes a message, if its type is allowed by the current `logLevel`.
     * @param message Message to publish.
     */
    log(message: LogMessage): void;

    /**
     * Publishes a message, if its type is allowed by the current `logLevel`.
     * @param message Message to publish.
     * @param type Message's type.
     */
    logMessage(message: string, type: LogType): void;

    /**
     * Publishes a debug message, if debug type is allowed by the current `logLevel`.
     * @param message Message to publish.
     */
    logDebug(message: string): void;

    /**
     * Publishes an information message, if information type is allowed by the current `logLevel`.
     * @param message Message to publish.
     */
    logInformation(message: string): void;

    /**
     * Publishes a warning message, if warning type is allowed by the current `logLevel`.
     * @param message Message to publish.
     */
    logWarning(message: string): void;

    /**
     * Publishes an error message, if error type is allowed by the current `logLevel`.
     * @param message Message, or error, to publish.
     */
    logError(message: string | Error): void;

    /**
     * Registers a logger listener.
     * @param delegate Logger listener's delegate.
     * @returns A new logger listener.
     */
    listen(delegate: LoggerDelegate): ILoggerListener;
}
