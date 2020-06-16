/** Represents a task state. */
export enum TaskState
{
    /** Specifies, that a task has been created, and it awaiting to be run. */
    Created = 0,

    /** Specifies, that a task is currently running. */
    Running = 1,

    /** Specifies, that a task has run to completion. */
    Completed = 2,

    /** Specifies, that a task has thrown an error. */
    Faulted = 3,

    /** Specifies, that a task has been cancelled. */
    Cancelled = 4,

    /** Specifies, that a task has been discontinued. */
    Discontinued = 5
}
