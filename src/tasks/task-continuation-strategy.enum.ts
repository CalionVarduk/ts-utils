/** Specifies available task continuation strategy flags. */
export enum TaskContinuationStrategy
{
    /** Specifies, that a task should never be continued. */
    None = 0,

    /** Specifies, that a task should be continued only if its parent has run to completion. */
    OnCompletion = 1,

    /** Specifies, that a task should be continued only if its parent has thrown an error. */
    OnError = 2,

    /** Specifies, that a task should be continued only if its parent has been cancelled. */
    OnCancellation = 4,

    /** Specifies, that a task should always be continued, unless its parent has already been discontinued. This is the default setting. */
    All = OnCompletion | OnError | OnCancellation
}
