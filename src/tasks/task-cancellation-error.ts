import { isUndefined } from '../functions';

/** Represents a task cancellation error. */
export class TaskCancellationError
    extends
    Error
{
    /**
     * Creates a new TaskCancellationError object.
     * @param reason An optional cancellation reason.
     */
    public constructor(reason?: string)
    {
        super(isUndefined(reason) ? 'task has been cancelled.' : `task has been cancelled. reason:\n${reason}.`);
    }
}
