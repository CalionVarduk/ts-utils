import { Task, ContinuationTask, TaskBase, JoinedTask, RacingTask, MappedTask } from '../../src/tasks/task';
import { TaskState } from '../../src/tasks/task-state.enum';
import { TaskCancellationError } from '../../src/tasks/task-cancellation-error';
import { TaskCancellationToken } from '../../src/tasks/task-cancellation-token';
import { Nullable } from '../../src/types/nullable';
import { TaskContinuationStrategy } from '../../src/tasks/task-continuation-strategy.enum';
import { ITask } from '../../src/tasks/task.interface';
import { TaskResult } from '../../src/tasks/task-result';
import { instanceOfCast, wait } from '../../src/functions';
import { TaskDiscontinuationError } from '../../src/tasks/task-discontinuation-error';
import { Iteration } from '../../src/collections/iteration';
import { MAX_TIME_OFFSET, MIN_TIME_OFFSET } from '../helpers';
import each from 'jest-each';

class ErrorTask extends TaskBase<void>
{
    public error: Error = new Error('error task');

    public constructor()
    {
        super();
    }

    protected handleExecution(_: (value: TaskResult<void>) => void): void
    {
        throw this.error;
    }
}

test('COMPLETED should be in Completed state',
    async () =>
    {
        const task = Task.COMPLETED;
        const result = await task.execute();

        expect(task.state).toBe(TaskState.Completed);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBeUndefined();
        expect(result.value).toBeUndefined();
        expect(Object.isFrozen(task)).toBe(true);
    }
);

test('FromError should create a proper task',
    async () =>
    {
        const error = new Error();
        const task = Task.FromError(error);
        const result = await task.execute();

        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBe(error);
        expect(result.value).toBeUndefined();
    }
);

test('FromCancelled should create a proper task',
    async () =>
    {
        const task = Task.FromCancelled();
        const result = await task.execute();

        expect(task.state).toBe(TaskState.Cancelled);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBeDefined();
        expect(result.error!.constructor).toBe(TaskCancellationError);
        expect(result.value).toBeUndefined();
    }
);

test('FromCancelled should create a proper task, with reason',
    async () =>
    {
        const reason = 'my cancellation reason';
        const task = Task.FromCancelled(reason);
        const result = await task.execute();

        expect(task.state).toBe(TaskState.Cancelled);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBeDefined();
        expect(result.error!.constructor).toBe(TaskCancellationError);
        expect((result.error as TaskCancellationError).message).toMatch(new RegExp(`.*${reason}.*`, 'g'));
        expect(result.value).toBeUndefined();
    }
);

test('FromResult should create a proper task',
    async () =>
    {
        const value = 'foo';
        const task = Task.FromResult(value);
        const result = await task.execute();

        expect(task.state).toBe(TaskState.Completed);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBeUndefined();
        expect(result.value).toBe(value);
    }
);

each([
    [-1],
    [0],
    [5],
    [10],
    [50],
    [100],
    [200],
    [300],
    [400],
    [500]
])
.test('Delay should create a proper task (%#): ms: %f',
    async (ms: number) =>
    {
        const task = Task.Delay(ms);

        const start = Date.now();
        const result = await task.execute();
        const end = Date.now();

        const elapsed = end - start;
        const expectedMin = ms - MIN_TIME_OFFSET;
        const expectedMax = ms + MAX_TIME_OFFSET;
        expect(elapsed).toBeGreaterThanOrEqual(expectedMin);
        expect(elapsed).toBeLessThanOrEqual(expectedMax);
        expect(task.state).toBe(TaskState.Completed);
        expect(result.state).toBe(task.state);
        expect(result.error).toBeUndefined();
        expect(result.value).toBeUndefined();
    }
);

test('All should create a proper joined task',
    () =>
    {
        const tasks = [Task.FromResult('foo'), Task.FromError<string>(new Error()), Task.FromCancelled<string>('foo')];
        const result = Task.All(tasks);
        expect(result instanceof JoinedTask).toBe(true);
        expect((result as JoinedTask<string>).tasks).toMatchObject(tasks);
    }
);

test('Any should create a proper racing task',
    () =>
    {
        const tasks = [Task.FromResult('foo'), Task.FromError<string>(new Error()), Task.FromCancelled<string>('foo')];
        const result = Task.Any(tasks);
        expect(result instanceof RacingTask).toBe(true);
        expect((result as RacingTask<string>).tasks).toMatchObject(tasks);
    }
);

test('ctor should create properly',
    () =>
    {
        const task = new Task(() => Promise.resolve());
        expect(task.state).toBe(TaskState.Created);
        expect(task.isDone).toBe(false);
    }
);

test('execute should invoke action and return proper result',
    async () =>
    {
        const value = 'foo';
        const task = new Task(() => Promise.resolve(value));

        const promise = task.execute();
        expect(task.state).toBe(TaskState.Running);
        expect(task.isDone).toBe(false);
        const result = await promise;

        expect(task.state).toBe(TaskState.Completed);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.value).toBe(value);
        expect(result.error).toBeUndefined();
    }
);

test('execute should invoke action and return proper result, for error',
    async () =>
    {
        const error = new Error();
        const task = new Task(() => Promise.resolve().then(() => { throw error; }));

        const promise = task.execute();
        expect(task.state).toBe(TaskState.Running);
        expect(task.isDone).toBe(false);
        const result = await promise;

        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.value).toBeUndefined();
        expect(result.error).toBe(error);
    }
);

test('execute should invoke action and return proper result, for cancellation',
    async () =>
    {
        const token = new TaskCancellationToken();
        token.cancel();
        const task = new Task(() => Promise.resolve().then(() => token.throwIfCancellationRequested()));

        const promise = task.execute();
        expect(task.state).toBe(TaskState.Running);
        expect(task.isDone).toBe(false);
        const result = await promise;

        expect(task.state).toBe(TaskState.Cancelled);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.value).toBeUndefined();
        expect(result.error).toBeDefined();
        expect(result.error!.constructor).toBe(TaskCancellationError);
    }
);

test('multiple execute calls should invoke action exactly once and return the same promise',
    async () =>
    {
        let actionCallCount = 0;
        const task = new Task(() =>
        {
            ++actionCallCount;
            return Promise.resolve();
        });

        const firstPromise = task.execute();
        const secondPromise = task.execute();
        await firstPromise;
        const thirdPromise = task.execute();

        expect(actionCallCount).toBe(1);
        expect(firstPromise).toBe(secondPromise);
        expect(secondPromise).toBe(thirdPromise);
    }
);

test('then should create a new task that invokes both tasks sequentially',
    async () =>
    {
        const parentValue = 'foo';
        const childValue = 5;
        const parentTask = new Task(() => Promise.resolve(parentValue));
        let childTask: Nullable<Task<[string, number]>> = null;

        const task = parentTask
            .then(r =>
            {
                childTask = new Task(() => Promise.resolve<[string, number]>([r.value!, childValue]));
                return childTask!;
            });

        expect(task instanceof ContinuationTask).toBe(true);
        expect((task as ContinuationTask<[string, number], string>).parentTask).toBe(parentTask);
        expect((task as ContinuationTask<[string, number], string>).continuationStrategy).toBe(TaskContinuationStrategy.All);
        const promise = task.execute();
        expect(task.state).toBe(TaskState.Running);
        expect(parentTask.state).toBe(TaskState.Running);
        expect(task.isDone).toBe(false);
        expect(parentTask.isDone).toBe(false);
        expect(childTask).toBeNull();
        const result = await promise;

        expect(parentTask.state).toBe(TaskState.Completed);
        expect(childTask!.state).toBe(TaskState.Completed);
        expect(task.state).toBe(childTask!.state);
        expect(task.isDone).toBe(true);
        expect(parentTask.isDone).toBe(true);
        expect(childTask!.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.value![0]).toBe(parentValue);
        expect(result.value![1]).toBe(childValue);
        expect(result.error).toBeUndefined();
    }
);

each([
    [Task.FromResult('foo'), TaskContinuationStrategy[TaskContinuationStrategy.OnCompletion], true],
    [Task.FromResult('foo'), TaskContinuationStrategy[TaskContinuationStrategy.OnCancellation], false],
    [Task.FromResult('foo'), TaskContinuationStrategy[TaskContinuationStrategy.OnError], false],
    [Task.FromResult('foo'), TaskContinuationStrategy[TaskContinuationStrategy.None], false],
    [Task.FromCancelled('foo'), TaskContinuationStrategy[TaskContinuationStrategy.OnCompletion], false],
    [Task.FromCancelled('foo'), TaskContinuationStrategy[TaskContinuationStrategy.OnCancellation], true],
    [Task.FromCancelled('foo'), TaskContinuationStrategy[TaskContinuationStrategy.OnError], false],
    [Task.FromCancelled('foo'), TaskContinuationStrategy[TaskContinuationStrategy.None], false],
    [Task.FromError(new Error()), TaskContinuationStrategy[TaskContinuationStrategy.OnCompletion], false],
    [Task.FromError(new Error()), TaskContinuationStrategy[TaskContinuationStrategy.OnCancellation], false],
    [Task.FromError(new Error()), TaskContinuationStrategy[TaskContinuationStrategy.OnError], true],
    [Task.FromError(new Error()), TaskContinuationStrategy[TaskContinuationStrategy.None], false],
    [Task.COMPLETED.then(() => Task.COMPLETED, TaskContinuationStrategy.None),
        TaskContinuationStrategy[TaskContinuationStrategy.None], false]
])
.test('then should continue properly, depending on the continuation strategy (%#): parent task: %o, strategy: %s, should be continued: %s',
    async (parentTask: ITask<any>, strategyName: keyof typeof TaskContinuationStrategy, shouldBeContinued: boolean) =>
    {
        const strategy = TaskContinuationStrategy[strategyName];
        let childTask: Nullable<Task<[TaskResult<any>, number]>> = null;

        const task = parentTask
            .then(r =>
            {
                childTask = new Task(() => Promise.resolve<[TaskResult<any>, number]>([r, 0]));
                return childTask!;
            },
            strategy);

        const result = await task.execute();

        expect(result.state).toBe(task.state);

        if (shouldBeContinued)
        {
            expect(task.state).toBe(childTask!.state);
            expect(result.value![0].state).toBe(parentTask.state);
        }
        else
        {
            expect(task.state).toBe(TaskState.Discontinued);
            const error = instanceOfCast(TaskDiscontinuationError, result.error);
            expect(error).not.toBeNull();
            expect(error!.parentResult.state).toBe(parentTask.state);
        }
    }
);

test('then should return task with failed state if parent task throws an unhandled error',
    async () =>
    {
        const parentTask = new ErrorTask();
        let childTask: Nullable<Task> = null;

        const task = parentTask.then(() =>
        {
            childTask = Task.COMPLETED;
            return childTask!;
        });

        const result = await task.execute();

        expect(parentTask.state).toBe(TaskState.Faulted);
        expect(task.state).toBe(TaskState.Faulted);
        expect(childTask).toBeNull();
        expect(task.isDone).toBe(true);
        expect(parentTask.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBe(parentTask.error);
    }
);

test('then should return task with failed state if child task throws an unhandled error',
    async () =>
    {
        const parentTask = Task.FromResult('foo');
        const childTask = new ErrorTask();

        const task = parentTask.then(() => childTask);

        const result = await task.execute();

        expect(parentTask.state).toBe(TaskState.Completed);
        expect(childTask.state).toBe(TaskState.Faulted);
        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);
        expect(parentTask.isDone).toBe(true);
        expect(childTask.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBe(childTask.error);
    }
);

test('join should create a new task that invokes all tasks simultaneously, and waits for the last task to resolve',
    async () =>
    {
        const taskResults = ['foo', 'bar', 'foobar'];
        const tasks = [
            Task.Delay(100).then(() => Task.FromResult(taskResults[0])),
            Task.FromResult(taskResults[1]),
            Task.Delay(200).then(() => Task.FromResult(taskResults[2]))
        ];

        const task = tasks[0]
            .join(tasks[1], tasks[2]);

        expect(task instanceof JoinedTask).toBe(true);
        expect((task as JoinedTask<string>).tasks).toMatchObject(tasks);
        const promise = task.execute();
        expect(task.state).toBe(TaskState.Running);
        expect(task.isDone).toBe(false);
        for (const joinedTask of tasks)
        {
            expect(joinedTask.state).toBe(TaskState.Running);
            expect(joinedTask.isDone).toBe(false);
        }
        const result = await promise;

        expect(task.state).toBe(TaskState.Completed);
        expect(task.isDone).toBe(true);
        for (const joinedTask of tasks)
        {
            expect(joinedTask.state).toBe(TaskState.Completed);
            expect(joinedTask.isDone).toBe(true);
        }
        expect(result.state).toBe(task.state);
        expect(result.value!.length).toBe(tasks.length);

        for (const resultData of Iteration.Zip(result.value!, taskResults))
        {
            expect(resultData.first.state).toBe(TaskState.Completed);
            expect(resultData.first.value).toBe(resultData.second);
        }
    }
);

test('joined task should invoke all tasks simultaneously, and wait for the last task to resolve, including non-completed tasks',
    async () =>
    {
        const completingTaskResult = 'foo';
        const failingTaskResult = new Error();
        const cancellingTaskReason = 'bar';

        const completingTask = Task.Delay(100).then(() => Task.FromResult(completingTaskResult));
        const failingTask = Task.FromError<string>(failingTaskResult);
        const cancellingTask = Task.Delay(200).then(() => Task.FromCancelled<string>(cancellingTaskReason));
        const discontinuingTask = Task.COMPLETED.then(() => Task.FromResult(''), TaskContinuationStrategy.None);

        const task = Task.All([completingTask, failingTask, cancellingTask, discontinuingTask]);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Completed);
        expect(task.isDone).toBe(true);

        expect(completingTask.state).toBe(TaskState.Completed);
        expect(completingTask.isDone).toBe(true);
        expect(failingTask.state).toBe(TaskState.Faulted);
        expect(failingTask.isDone).toBe(true);
        expect(cancellingTask.state).toBe(TaskState.Cancelled);
        expect(cancellingTask.isDone).toBe(true);
        expect(discontinuingTask.state).toBe(TaskState.Discontinued);
        expect(discontinuingTask.isDone).toBe(true);

        expect(result.state).toBe(task.state);
        expect(result.value!.length).toBe(4);

        const completedResult = result.value![0];
        const failedResult = result.value![1];
        const cancelledResult = result.value![2];
        const discontinuedResult = result.value![3];

        expect(completedResult.state).toBe(completingTask.state);
        expect(completedResult.value).toBe(completingTaskResult);
        expect(failedResult.state).toBe(failingTask.state);
        expect(failedResult.error).toBe(failingTaskResult);
        expect(cancelledResult.state).toBe(cancellingTask.state);
        expect(cancelledResult.error instanceof TaskCancellationError).toBe(true);
        expect((cancelledResult.error as TaskCancellationError).message).toMatch(new RegExp(`.*${cancellingTaskReason}.*`, 'g'));
        expect(discontinuedResult.state).toBe(discontinuingTask.state);
        expect(discontinuedResult.error instanceof TaskDiscontinuationError).toBe(true);
    }
);

test('empty joined task should resolve properly, with an empty result value collection',
    async () =>
    {
        const task = new JoinedTask([]);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Completed);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.value).toMatchObject([]);
    }
);

test('joined task should resolve to a failed state if any internal task throws an error',
    async () =>
    {
        const tasks = [
            new ErrorTask(),
            Task.Delay(200),
            new ErrorTask(),
            Task.Delay(100).then(() => Task.FromError(new Error()))
        ];

        const task = Task.All(tasks);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);
        for (const joinedTask of tasks)
            expect(joinedTask.isDone).toBe(true);

        expect(result.state).toBe(task.state);
        expect(result.value).toBeUndefined();
        expect(result.error instanceof Array).toBe(true);
        expect(result.error!.length).toBe(2);
        expect(result.error).toContain((tasks[0] as ErrorTask).error);
        expect(result.error).toContain((tasks[2] as ErrorTask).error);
    }
);

test('joined task should resolve to a failed state if the only internal task throws an error',
    async () =>
    {
        const tasks = [
            new ErrorTask()
        ];

        const task = Task.All(tasks);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);
        for (const joinedTask of tasks)
            expect(joinedTask.isDone).toBe(true);

        expect(result.state).toBe(task.state);
        expect(result.value).toBeUndefined();
        expect(result.error instanceof Array).toBe(true);
        expect(result.error!.length).toBe(1);
        expect(result.error).toContain((tasks[0] as ErrorTask).error);
    }
);

test('race should create a new task that invokes all tasks simultaneously, and waits for the first task to resolve',
    async () =>
    {
        const taskResults = ['foo', 'bar', 'foobar'];
        const tasks = [
            Task.Delay(100).then(() => Task.FromResult(taskResults[0])),
            Task.FromResult(taskResults[1]),
            Task.Delay(200).then(() => Task.FromResult(taskResults[2]))
        ];

        const task = tasks[0]
            .race(tasks[1], tasks[2]);

        expect(task instanceof RacingTask).toBe(true);
        expect((task as RacingTask<string>).tasks).toMatchObject(tasks);
        const promise = task.execute();
        expect(task.state).toBe(TaskState.Running);
        expect(task.isDone).toBe(false);
        for (const racingTask of tasks)
        {
            expect(racingTask.state).toBe(TaskState.Running);
            expect(racingTask.isDone).toBe(false);
        }
        const result = await promise;

        expect(task.state).toBe(TaskState.Completed);
        expect(task.isDone).toBe(true);

        expect(tasks[0].state).toBe(TaskState.Running);
        expect(tasks[0].isDone).toBe(false);
        expect(tasks[1].state).toBe(TaskState.Completed);
        expect(tasks[1].isDone).toBe(true);
        expect(tasks[2].state).toBe(TaskState.Running);
        expect(tasks[2].isDone).toBe(false);

        expect(result.state).toBe(task.state);
        expect(result.value).toBe(taskResults[1]);
        await wait(300);
    }
);

test('racing task should resolve correctly, when the first task is faulty',
    async () =>
    {
        const tasks = [
            Task.Delay(100).then(() => Task.FromResult('foo')),
            Task.FromError<string>(new Error())
        ];

        const task = Task.Any(tasks);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBe((await tasks[1].execute()).error);
        await wait(200);
    }
);

test('racing task should resolve correctly, when the first task is cancelled',
    async () =>
    {
        const tasks = [
            Task.Delay(100).then(() => Task.FromResult('foo')),
            Task.FromCancelled<string>()
        ];

        const task = Task.Any(tasks);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Cancelled);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBe((await tasks[1].execute()).error);
        await wait(200);
    }
);

test('racing task should resolve correctly, when the first task is discontinued',
    async () =>
    {
        const tasks = [
            Task.Delay(100).then(() => Task.FromResult('foo')),
            Task.COMPLETED.then(() => Task.FromResult(''), TaskContinuationStrategy.None)
        ];

        const task = Task.Any(tasks);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Discontinued);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBe((await tasks[1].execute()).error);
        await wait(200);
    }
);

test('empty racing task should resolve to a faulty state',
    async () =>
    {
        const task = new RacingTask([]);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error instanceof Error).toBe(true);
    }
);

test('racing task should resolve to a failed state if the first internal task to resolve throws an error',
    async () =>
    {
        const tasks = [
            new ErrorTask(),
            Task.Delay(200),
            Task.Delay(100).then(() => Task.FromError(new Error())),
            new ErrorTask()
        ];

        const task = Task.Any(tasks);

        const result = await task.execute();

        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);

        expect(tasks[0].state).toBe(TaskState.Faulted);
        expect(tasks[0].isDone).toBe(true);
        expect(tasks[1].state).toBe(TaskState.Running);
        expect(tasks[1].isDone).toBe(false);
        expect(tasks[2].state).toBe(TaskState.Running);
        expect(tasks[2].isDone).toBe(false);

        expect(result.state).toBe(task.state);
        expect(result.value).toBeUndefined();
        expect(result.error).toBe((tasks[0] as ErrorTask).error);
        await wait(300);
    }
);

test('map should create a new task that invokes right after the source task',
    async () =>
    {
        const sourceValue = 'foo';
        const mapper = (result: string) => result.split('');
        const sourceTask = new Task(() => Promise.resolve(sourceValue));

        const task = sourceTask
            .map(mapper);

        expect(task instanceof MappedTask).toBe(true);
        expect((task as MappedTask<string[], string>).sourceTask).toBe(sourceTask);
        expect((task as MappedTask<string[], string>).mapper).toBe(mapper);
        const promise = task.execute();
        expect(task.state).toBe(TaskState.Running);
        expect(sourceTask.state).toBe(TaskState.Running);
        expect(task.isDone).toBe(false);
        expect(sourceTask.isDone).toBe(false);
        const result = await promise;

        expect(sourceTask.state).toBe(TaskState.Completed);
        expect(task.state).toBe(sourceTask.state);
        expect(task.isDone).toBe(true);
        expect(sourceTask.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.value!.join('')).toBe(sourceValue);
        expect(result.error).toBeUndefined();
    }
);

each([
    [Task.FromCancelled('foo')],
    [Task.FromError(new Error())],
    [Task.COMPLETED.then(() => Task.COMPLETED, TaskContinuationStrategy.None)]
])
.test('map should propagate the source\'s task error (%#): source task: %o',
    async (sourceTask: ITask<any>) =>
    {
        const task = sourceTask
            .map(r => r);

        const result = await task.execute();

        expect(task.state).toBe(sourceTask.state);
        expect(result.state).toBe(task.state);
        expect(result.value).toBe((await sourceTask.execute()).value);
        expect(result.error).toBe((await sourceTask.execute()).error);
    }
);

test('map should return task with failed state if source task throws an unhandled error',
    async () =>
    {
        const sourceTask = new ErrorTask();
        const task = sourceTask
            .map(() => 0);

        const result = await task.execute();

        expect(sourceTask.state).toBe(TaskState.Faulted);
        expect(task.state).toBe(TaskState.Faulted);
        expect(task.isDone).toBe(true);
        expect(sourceTask.isDone).toBe(true);
        expect(result.state).toBe(task.state);
        expect(result.error).toBe(sourceTask.error);
    }
);
