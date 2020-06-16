import { Nullable, makeRef } from '../types';
import { TaskState } from './task-state.enum';
import { isInstanceOfType, wait, isNull, deepFreeze, isUndefined, reinterpretCast } from '../functions';
import { ITask } from './task.interface';
import { TaskResult } from './task-result';
import { TaskContinuationStrategy } from './task-continuation-strategy.enum';
import { TaskCancellationError } from './task-cancellation-error';
import { TaskDiscontinuationError } from './task-discontinuation-error';
import { Iteration } from '../collections/iteration';

function createCompletedTask(): Task
{
    const task = new Task(() => Promise.resolve());
    task.execute().then(() => deepFreeze(task));
    return task;
}

/** An abstract class representing a runnable, asynchronous task. */
export abstract class TaskBase<T = void>
    implements
    ITask<T>
{
    public get state(): TaskState
    {
        return this._state;
    }

    public get isDone(): boolean
    {
        return this._state > TaskState.Running;
    }

    private _state: TaskState;
    private _result: Nullable<Promise<TaskResult<T>>>;

    /**
     * Creates a new TaskBase object.
     */
    protected constructor()
    {
        this._state = TaskState.Created;
        this._result = null;
    }

    public execute(): Promise<TaskResult<T>>
    {
        if (isNull(this._result))
            this._result = new Promise((resolve, reject) =>
                {
                    this._state = TaskState.Running;
                    try
                    {
                        this.handleExecution(resolve);
                    }
                    catch (e)
                    {
                        this._state = TaskState.Faulted;
                        reject(e);
                    }
                });

        return this._result;
    }

    public then<U = void>(
        taskProvider: (parentResult: TaskResult<T>) => ITask<U>,
        continuationStrategy?: TaskContinuationStrategy):
        ITask<U>
    {
        return new ContinuationTask<U, T>(this, taskProvider, continuationStrategy);
    }

    public join(...tasks: ITask<T>[]): ITask<TaskResult<T>[]>
    {
        return new JoinedTask<T>([this, ...tasks]);
    }

    public race(...tasks: ITask<T>[]): ITask<T>
    {
        return new RacingTask<T>([this, ...tasks]);
    }

    public map<U>(mapper: (result: T) => U): ITask<U>
    {
        return new MappedTask<U, T>(this, mapper);
    }

    /**
     * An abstract task execution handling function. Allows to define the task's behavior.
     * @param resolve Task's promise resolver function.
     */
    protected abstract handleExecution(resolve: (value: TaskResult<T>) => void): void;

    /**
     * Allows to resolve the task with `TaskState.Faulted` state.
     * @param resolve Task's promise resolver function.
     * @param error An error describing the task's failure.
     */
    protected onError(resolve: (value: TaskResult<T>) => void, error: any): void
    {
        this._state = TaskState.Faulted;
        const result = {
            state: this._state,
            error: error
        };
        resolve(result);
    }

    /**
     * Allows to resolve the task with `TaskState.Cancelled` state.
     * @param resolve Task's promise resolver function.
     * @param error A cancellation error instance.
     */
    protected onCancelled(resolve: (value: TaskResult<T>) => void, error: TaskCancellationError): void
    {
        this._state = TaskState.Cancelled;
        const result = {
            state: this._state,
            error: error
        };
        resolve(result);
    }

    /**
     * Allows to resolve the task with `TaskState.Discontinued` state.
     * @param resolve Task's promise resolver function.
     * @param error A discontinuation error instance.
     */
    protected onDiscontinued<U>(resolve: (value: TaskResult<T>) => void, error: TaskDiscontinuationError<U>): void
    {
        this._state = TaskState.Discontinued;
        const result = {
            state: this._state,
            error: error
        };
        resolve(result);
    }

    /**
     * Allows to resolve the task with `TaskState.Completed` state.
     * @param resolve Task's promise resolver function.
     * @param value Task's result.
     */
    protected onCompleted(resolve: (value: TaskResult<T>) => void, value: T): void
    {
        this._state = TaskState.Completed;
        const result = {
            state: this._state,
            value: value
        };
        resolve(result);
    }

    /**
     * Allows to resolve the task according to its child task's result.
     * @param resolve Task's promise resolver function.
     * @param childResult Child task's result.
     */
    protected onChildCompleted(resolve: (value: TaskResult<T>) => void, childResult: TaskResult<T>): void
    {
        this._state = childResult.state;
        const result = {
            state: childResult.state,
            value: childResult.value,
            error: childResult.error
        };
        resolve(result);
    }
}

/** Represents a runnable, asynchronous, promise-based task. */
export class Task<T = void>
    extends
    TaskBase<T>
{
    /** A completed task instance. */
    public static readonly COMPLETED: Task = createCompletedTask();

    /**
     * Creates a new, faulty task.
     * @param error An error describing the task's failure.
     * @returns A new task.
     */
    public static FromError<U = void>(error: any): Task<U>
    {
        return new Task<U>(() => Promise.reject(error));
    }

    /**
     * Creates a new, cancelled task.
     * @param reason An optional cancellation reason.
     * @returns A new task.
     */
    public static FromCancelled<U = void>(reason?: string): Task<U>
    {
        return Task.FromError<U>(new TaskCancellationError(reason));
    }

    /**
     * Creates a new, completed task with a result.
     * @param result Task's result.
     * @returns A new task.
     */
    public static FromResult<U>(result: U): Task<U>
    {
        return new Task(() => Promise.resolve(result));
    }

    /**
     * Creates a new task, that completes after the specified amount of time.
     * @param ms Time (in milliseconds) to wait before completing the task.
     * @returns A new task.
     */
    public static Delay(ms: number): Task
    {
        return new Task(() => wait(ms));
    }

    /**
     * Creates a new task that joins a range of tasks, in order to run them simultaneously and wait for all of them to finish running.
     * @param tasks Tasks to join.
     * @returns A new task.
     */
    public static All<U>(tasks: Iterable<ITask<U>>): ITask<TaskResult<U>[]>
    {
        return new JoinedTask<U>(tasks);
    }

    /**
     * Creates a new task that races a range of tasks, in order to run them simultaneously and wait for the first task to finish running.
     * @param tasks Tasks to race.
     * @returns A new task.
     */
    public static Any<U>(tasks: Iterable<ITask<U>>): ITask<U>
    {
        return new RacingTask<U>(tasks);
    }

    private readonly _action: () => Promise<T>;

    /**
     * Creates a new Task object.
     * @param action An action function that serves as the task's promise factory.
     */
    public constructor(action: () => Promise<T>)
    {
        super();
        this._action = action;
    }

    protected handleExecution(resolve: (value: TaskResult<T>) => void): void
    {
        this._action().then(
            result => this.onCompleted(resolve, result),
            error =>
            {
                if (isInstanceOfType(TaskCancellationError, error))
                    this.onCancelled(resolve, error);
                else
                    this.onError(resolve, error);
            });
    }
}

/** Represents a runnable, asynchronous continuation task. */
export class ContinuationTask<T = void, TParent = void>
    extends
    TaskBase<T>
{
    /** Specifies the parent task. */
    public readonly parentTask: ITask<TParent>;

    /** Specifies the parent task's continuation strategy. */
    public readonly continuationStrategy: TaskContinuationStrategy;

    private readonly _taskProvider: (parentResult: TaskResult<TParent>) => ITask<T>;

    /**
     * Creates a new ContinuationTask object.
     * @param parent A parent task.
     * @param taskProvider A child task provider function.
     * @param continuationStrategy An optional task continuation strategy.
     */
    public constructor(
        parent: ITask<TParent>,
        taskProvider: (parentResult: TaskResult<TParent>) => ITask<T>,
        continuationStrategy?: TaskContinuationStrategy)
    {
        super();
        this.parentTask = parent;
        this._taskProvider = taskProvider;
        this.continuationStrategy = isUndefined(continuationStrategy) ? TaskContinuationStrategy.All : continuationStrategy;
    }

    protected handleExecution(resolve: (value: TaskResult<T>) => void): void
    {
        this.parentTask.execute().then(
            parentResult =>
            {
                const continuationStrategyFlag = (function()
                {
                    switch (parentResult.state)
                    {
                        case TaskState.Completed:
                            return TaskContinuationStrategy.OnCompletion;
                        case TaskState.Faulted:
                            return TaskContinuationStrategy.OnError;
                        case TaskState.Cancelled:
                            return TaskContinuationStrategy.OnCancellation;
                    }
                    return TaskContinuationStrategy.None;
                })();

                if ((this.continuationStrategy & continuationStrategyFlag) === TaskContinuationStrategy.None)
                {
                    const error = new TaskDiscontinuationError(parentResult);
                    this.onDiscontinued(resolve, error);
                    return;
                }

                const childTask = this._taskProvider(parentResult);
                childTask.execute().then(
                    childResult => this.onChildCompleted(resolve, childResult),
                    childError => this.onError(resolve, childError));
            },
            parentError => this.onError(resolve, parentError));
    }
}

/** Represents a runnable, asynchronous joined task. */
export class JoinedTask<T = void>
    extends
    TaskBase<TaskResult<T>[]>
{
    /** Represents a range of tasks to join. */
    public readonly tasks: Iterable<ITask<T>>;

    /**
     * Creates a new JoinedTask object.
     * @param tasks Tasks to join.
     */
    public constructor(tasks: Iterable<ITask<T>>)
    {
        super();
        this.tasks = tasks;
    }

    protected handleExecution(resolve: (value: TaskResult<TaskResult<T>[]>) => void): void
    {
        const taskArray = Iteration.ToArray(
            Iteration.Map(this.tasks,
            (t, idx) =>
            {
                return {
                    task: t,
                    index: idx
                };
            }));

        if (taskArray.length === 0)
        {
            this.onCompleted(resolve, []);
            return;
        }

        const taskResults: TaskResult<T>[] = Array(taskArray.length);
        const errors: any[] = [];
        let resolvedTasks = 0;

        for (let i = 0; i < taskArray.length; ++i)
        {
            const entry = taskArray[i];
            entry.task.execute().then(
                taskResult =>
                {
                    taskResults[entry.index] = taskResult;
                    if (++resolvedTasks === taskArray.length)
                    {
                        if (errors.length === 0)
                            this.onCompleted(resolve, taskResults);
                        else
                            this.onError(resolve, errors);
                    }
                },
                error =>
                {
                    errors.push(error);
                    if (++resolvedTasks === taskArray.length)
                        this.onError(resolve, errors);
                });
        }
    }
}

/** Represents a runnable, asynchronous racing task. */
export class RacingTask<T = void>
    extends
    TaskBase<T>
{
    /** Represents a range of tasks to race. */
    public readonly tasks: Iterable<ITask<T>>;

    /**
     * Creates a new RacingTask object.
     * @param tasks Tasks to race.
     */
    public constructor(tasks: Iterable<ITask<T>>)
    {
        super();
        this.tasks = tasks;
    }

    protected handleExecution(resolve: (value: TaskResult<T>) => void): void
    {
        const tasks = Iteration.Materialize(this.tasks);
        if (Iteration.IsEmpty(tasks))
        {
            this.onError(resolve, new Error('RacingTask requires at least one internal task'));
            return;
        }

        for (const task of tasks)
            task.execute().then(
                taskResult =>
                {
                    if (this.state === TaskState.Running)
                        this.onChildCompleted(resolve, taskResult);
                },
                error =>
                {
                    if (this.state === TaskState.Running)
                        this.onError(resolve, error);
                });
    }
}

/** Represents a runnable, asynchronous mapped task. */
export class MappedTask<T = void, TSource = void>
    extends
    TaskBase<T>
{
    /** Specifies the source task. */
    public readonly sourceTask: ITask<TSource>;

    /** Specifies the source result mapping function. */
    public readonly mapper: (result: TSource) => T;

    /**
     * Creates a new MappedTask object.
     * @param sourceTask A source task.
     * @param mapper A source task result mapping function.
     */
    public constructor(sourceTask: ITask<TSource>, mapper: (result: TSource) => T)
    {
        super();
        this.sourceTask = sourceTask;
        this.mapper = mapper;
    }

    protected handleExecution(resolve: (value: TaskResult<T>) => void): void
    {
        this.sourceTask.execute().then(
            sourceResult =>
            {
                if (sourceResult.state !== TaskState.Completed)
                {
                    this.onChildCompleted(resolve, reinterpretCast<TaskResult<T>>(sourceResult));
                    return;
                }
                const mappedResult = this.mapper(sourceResult.value!);
                this.onCompleted(resolve, mappedResult);
            },
            sourceError => this.onError(resolve, sourceError));
    }
}
