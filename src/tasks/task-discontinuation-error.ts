import { TaskState } from './task-state.enum';
import { TaskResult } from './task-result';

/** Represents a task discontinuation error. */
export class TaskDiscontinuationError<T = void>
    extends
    Error
{
    /** Specifies parent task result, that caused the discontinuation. */
    public readonly parentResult: TaskResult<T>;

    /**
     * Creates a new TaskDiscontinuationError object.
     * @param parentResult A parent task result, that caused the discontinuation.
     */
    public constructor(parentResult: TaskResult<T>)
    {
        super(`task has been discontinued due to unhandled ${TaskState[parentResult.state]} state`);
        this.parentResult = parentResult;
    }
}
