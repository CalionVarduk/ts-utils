import { TaskState } from './task-state.enum';

/** Represents a task result. */
export type TaskResult<T = void> =
{
    /** Specifies the resulting task state. */
    readonly state: TaskState;

    /** Specifies the resulting task value, if run to completion. */
    readonly value?: T;

    /** Specifies the resulting task error, if an error has been encountered. */
    readonly error?: any;
};
