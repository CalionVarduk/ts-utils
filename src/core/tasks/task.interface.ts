import { TaskResult } from './task-result';
import { TaskState } from './task-state.enum';
import { TaskContinuationStrategy } from './task-continuation-strategy.enum';

/** Represents a runnable, asynchronous task. */
export interface ITask<T = void>
{
    /** Specifies the task's current state. */
    readonly state: TaskState;

    /** Specifies, whether or not the task has finished running. */
    readonly isDone: boolean;

    /**
     * Runs the task.
     * @returns An awaitable task promise.
     */
    execute(): Promise<TaskResult<T>>;

    /**
     * Specifies a task to continue with, after this task has finished running.
     * @param taskProvider A child task provider function.
     * @param continuationStrategy An optional task continuation strategy.
     * @returns A new task.
     */
    then<U = void>(
        taskProvider: (parentResult: TaskResult<T>) => ITask<U>,
        continuationStrategy?: TaskContinuationStrategy):
        ITask<U>;

    /**
     * Specifies a range of tasks to join with this task, in order to run them simultaneously and wait for all of them to finish running.
     * @param tasks Tasks to join.
     * @returns A new task.
     */
    join(...tasks: ITask<T>[]): ITask<TaskResult<T>[]>;

    /**
     * Specifies a range of tasks to race with this task, in order to run them simultaneously and wait for the first task to finish running.
     * @param tasks Tasks to race.
     * @returns A new task.
     */
    race(...tasks: ITask<T>[]): ITask<T>;

    /**
     * Specifies a result mapping function, that transforms the task's result.
     * Mapping function is invoked only, when the task runs to completion.
     * @param mapper A result mapping function.
     * @returns A new task.
     */
    map<U>(mapper: (result: T) => U): ITask<U>;
}
