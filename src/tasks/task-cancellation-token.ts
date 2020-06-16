import { wait } from '../functions/wait';
import { TaskCancellationError } from './task-cancellation-error';
import { Undefinable } from '../types';

/** Represents a task cancellation token. */
export class TaskCancellationToken
{
    /** Specifies, whether or not the cancellation has already been requested. */
    public get isCancellationRequested(): boolean
    {
        return this._isCancellationRequested;
    }

    /** Specifies the cancellation reason. */
    public get cancellationReason(): Undefinable<string>
    {
        return this._reason;
    }

    private _isCancellationRequested: boolean;
    private _reason?: string;

    /**
     * Creates a new TaskCancellationToken object.
     */
    public constructor()
    {
        this._isCancellationRequested = false;
        this._reason = void(0);
    }

    /**
     * Marks the token as cancelled.
     * @param reason An optional cancellation reason.
     */
    public cancel(reason?: string): void
    {
        this._isCancellationRequested = true;
        this._reason = reason;
    }

    /**
     * Marks the token as cancelled, after a certain amount of time passes.
     * @param ms An amount of time (in milliseconds) to wait, before the token will be cancelled.
     * @param reason An optional cancellation reason.
     */
    public cancelAfter(ms: number, reason?: string): void
    {
        wait(ms)
            .then(() => this.cancel(reason));
    }

    /**
     * Throws a `TaskCancellationError`, if cancellation has been requested.
     * @throws A `TaskCancellationError`, if cancellation has been requested.
     */
    public throwIfCancellationRequested(): void
    {
        if (this.isCancellationRequested)
            throw new TaskCancellationError(this._reason);
    }
}
