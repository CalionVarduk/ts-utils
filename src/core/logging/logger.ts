import { ILogger, ILoggerListener, LoggerDelegate } from './logger.interface';
import { LogType } from './log-type.enum';
import { StopWatch } from '../stopwatch';
import { LogMessage } from './log-message';
import { Assert } from '../functions/assert';
import { Nullable } from '../types/nullable';
import { isNull } from '../functions/is-null';
import { Ref, makeRef } from '../types/ref';

/**
 * Creates a logger delegate, that logs messages to the console.
 * @returns A new logger delegate.
 */
export function createConsoleLogger(): LoggerDelegate
{
    return (m, t) =>
    {
        switch (m.type)
        {
            case LogType.Debug:
                {
                    console.debug(t, m.message);
                    break;
                }
            case LogType.Information:
                {
                    console.info(t, m.message);
                    break;
                }
            case LogType.Warning:
                {
                    console.warn(t, m.message);
                    break;
                }
            case LogType.Error:
                {
                    console.error(t, m.message);
                    break;
                }
        }
    };
}

class LoggerListener
    implements
    ILoggerListener
{
    public get isDisposed(): boolean
    {
        return isNull(this._disposer);
    }

    public readonly delegate: LoggerDelegate;

    private _disposer: Nullable<() => void>;

    public constructor(
        delegate: LoggerDelegate,
        listeners: ILoggerListener[],
        version: Ref<number>)
    {
        this.delegate = delegate;
        this._disposer = () =>
            {
                const index = listeners.findIndex(l => l === this);
                if (index !== -1)
                {
                    listeners.splice(index, 1);
                    ++version.value;
                }
                this._disposer = null;
            };
    }

    public dispose(): void
    {
        if (!isNull(this._disposer))
            this._disposer();
    }
}

/** Represents a logger that can be listened to. */
export class Logger
    implements
    ILogger
{
    public get listeners(): ReadonlyArray<ILoggerListener>
    {
        return this._listeners;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    public get timestamp(): number
    {
        return this._stopwatch.elapsedMs;
    }

    public logLevel: LogType;

    private readonly _listeners: LoggerListener[];
    private readonly _stopwatch: StopWatch;
    private readonly _version: Ref<number>;
    private _isDisposed: boolean;

    /**
     * Creates a new Logger object.
     */
    public constructor()
    {
        this._listeners = [];
        this._isDisposed = false;
        this.logLevel = LogType.Debug;
        this._version = makeRef(0);
        this._stopwatch = new StopWatch(true);
    }

    public dispose(): void
    {
        if (this._isDisposed)
            return;

        const listeners = [...this._listeners];
        this._listeners.splice(0, this._listeners.length);

        for (const listener of listeners)
            listener.dispose();

        this._stopwatch.stop();
        this._isDisposed = true;
    }

    public log(message: LogMessage): void
    {
        if (message.type >= this.logLevel)
            this._log(message);
    }

    public logMessage(message: string, type: LogType): void
    {
        if (type >= this.logLevel)
            this._log(new LogMessage(message, type));
    }

    public logDebug(message: string): void
    {
        if (LogType.Debug >= this.logLevel)
            this._log(LogMessage.Debug(message));
    }

    public logInformation(message: string): void
    {
        if (LogType.Information >= this.logLevel)
            this._log(LogMessage.Information(message));
    }

    public logWarning(message: string): void
    {
        if (LogType.Warning >= this.logLevel)
            this._log(LogMessage.Warning(message));
    }

    public logError(message: string | Error): void
    {
        if (LogType.Error >= this.logLevel)
            this._log(LogMessage.Error(message));
    }

    public listen(delegate: LoggerDelegate): ILoggerListener
    {
        Assert.False(this._isDisposed, 'cannot listen to a disposed logger.');
        const result = new LoggerListener(delegate, this._listeners, this._version);
        this._listeners.push(result);
        ++this._version.value;
        return result;
    }

    private _log(message: LogMessage): void
    {
        const timestamp = this.timestamp;
        const length = this._listeners.length;
        const version = this._version.value;

        let i = 0;
        while (i < length)
        {
            const listener = this._listeners[i];
            listener.delegate(message, timestamp, this);
            Assert.True(version === this._version.value, 'logger listener collection has changed during message logging');
            ++i;
        }
    }
}
