import { Nullable } from './types/nullable';
import { isNull } from './functions/is-null';

/** Represents deferred action's parameters. */
export type DeferredActionParams<TArgs = any> =
{
    /** Time in milliseconds after which the action will be executed. */
    timeoutMs: number;
    /** Action to be executed. */
    action(args?: TArgs): void;
};

/** Represets a deferred function execution environment. */
export class DeferredAction<TArgs = any>
{
    /** Returns whether or not the action is in the middle of being invoked. */
    public get isInvoking(): boolean
    {
        return !isNull(this._timeoutHandle);
    }

    /** Time in milliseconds after which the action will be executed. */
    public readonly timeoutMs: number;

    /** Deferred action's function to be executed. */
    public readonly action: (args?: TArgs) => void;

    private _timeoutHandle: Nullable<number>;

    /**
     * Creates a new deferred action object.
     * @param params deferred action's parameters
     */
    public constructor(params: DeferredActionParams<TArgs>)
    {
        this.timeoutMs = params.timeoutMs;
        this.action = params.action;
        this._timeoutHandle = null;
    }

    /**
     * Starts the action's invocation. If an invocation was already taking place, then the timer will be restarted.
     * @param args optional action's arguments
     */
    public invoke(args?: TArgs): void
    {
        this.stop();
        this._timeoutHandle = setTimeout(() =>
        {
            this.action(args);
            this._timeoutHandle = null;
        },
        this.timeoutMs);
    }

    /**
     * Stops the action's invocation, if it is taking place.
     * @returns `true` if the invocation in progress has been stopped, otherwise `false`
     */
    public stop(): boolean
    {
        if (this.isInvoking)
        {
            clearTimeout(this._timeoutHandle!);
            this._timeoutHandle = null;
            return true;
        }
        return false;
    }
}
