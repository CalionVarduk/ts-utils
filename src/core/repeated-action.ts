import { isNull } from './functions/is-null';
import { Nullable } from './types/nullable';

/** Represents repeated action's invocation result. */
export enum RepeatedActionResult
{
    /** Signals the repeater to continue executing the action at the specified interval. */
    Continue = 0,
    /** Signals the repeater to break the action execution loop. */
    Done = 1
}

/** Represents repeated action's parameters. */
export type RepeatedActionParams<TArgs = any> =
{
    /** Time frequency in milliseconds with which the action will be executed. */
    intervalMs: number;

    /** Action to be executed. */
    action(args?: TArgs): RepeatedActionResult;
};

/** Represets a repeating function execution environment. */
export class RepeatedAction<TArgs = any>
{
    /** Returns whether or not the action is currently running. */
    public get isRunning(): boolean
    {
        return !isNull(this._intervalHandle);
    }

    /** Returns the current invocation count since the last reset. */
    public get invocationCount(): number
    {
        return this._invocationCount;
    }

    /** Time frequency in milliseconds with which the action will be executed. */
    public readonly intervalMs: number;

    /** Repeated action's function to be executed. */
    public readonly action: (args?: TArgs) => RepeatedActionResult;

    private _intervalHandle: Nullable<number>;
    private _invocationCount: number;

    /**
     * Creates a new repeated action object.
     * @param params Repeated action's parameters.
     */
    public constructor(params: RepeatedActionParams<TArgs>)
    {
        this.intervalMs = params.intervalMs;
        this.action = params.action;
        this._intervalHandle = null;
        this._invocationCount = 0;
    }

    /**
     * Starts the action's invocation loop. If an invocation loop was already taking place, then it will be restarted.
     * @param args Optional action's arguments.
     */
    public invoke(args?: TArgs): void
    {
        this.stop();
        this._intervalHandle = setInterval(() =>
        {
            const result = this.action(args);
            if (result === RepeatedActionResult.Done)
                this._stopImpl();
            else
                ++this._invocationCount;
        },
        this.intervalMs);
    }

    /**
     * Stops the action's invocation loop, if it is running.
     * @returns `true` if the invocation loop in progress has been stopped, otherwise `false`.
     */
    public stop(): boolean
    {
        if (this.isRunning) {
            this._stopImpl();
            return true;
        }
        return false;
    }

    private _stopImpl(): void
    {
        clearInterval(this._intervalHandle!);
        this._intervalHandle = null;
        this._invocationCount = 0;
    }
}
