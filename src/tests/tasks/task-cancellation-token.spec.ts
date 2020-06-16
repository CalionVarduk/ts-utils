import { TaskCancellationToken } from '../../core/tasks/task-cancellation-token';
import { TaskCancellationError } from '../../core/tasks/task-cancellation-error';
import each from 'jest-each';
import { wait } from '../../core/functions';
import { MIN_TIME_OFFSET, MAX_TIME_OFFSET } from '../helpers';

test('ctor should create properly',
    () =>
    {
        const result = new TaskCancellationToken();
        expect(result.cancellationReason).toBeUndefined();
        expect(result.isCancellationRequested).toBe(false);
    }
);

test('cancel should mark token for cancellation',
    () =>
    {
        const token = new TaskCancellationToken();

        token.cancel();

        expect(token.cancellationReason).toBeUndefined();
        expect(token.isCancellationRequested).toBe(true);
    }
);

test('cancel should mark token for cancellation, with reason',
    () =>
    {
        const reason = 'foo';
        const token = new TaskCancellationToken();

        token.cancel(reason);

        expect(token.cancellationReason).toBe(reason);
        expect(token.isCancellationRequested).toBe(true);
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
.test('cancelAfter should mark token for cancellation after specified time (%#): ms: %f',
    async (ms: number) =>
    {
        const token = new TaskCancellationToken();

        const start = Date.now();
        token.cancelAfter(ms);
        await wait(ms);
        const end = Date.now();

        const elapsed = end - start;
        const expectedMin = ms - MIN_TIME_OFFSET;
        const expectedMax = ms + MAX_TIME_OFFSET;
        expect(elapsed).toBeGreaterThanOrEqual(expectedMin);
        expect(elapsed).toBeLessThanOrEqual(expectedMax);
        expect(token.cancellationReason).toBeUndefined();
        expect(token.isCancellationRequested).toBe(true);
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
.test('cancelAfter should mark token for cancellation after specified time, with reason (%#): ms: %f',
    async (ms: number) =>
    {
        const reason = 'foo';
        const token = new TaskCancellationToken();

        const start = Date.now();
        token.cancelAfter(ms, reason);
        await wait(ms);
        const end = Date.now();

        const elapsed = end - start;
        const expectedMin = ms - MIN_TIME_OFFSET;
        const expectedMax = ms + MAX_TIME_OFFSET;
        expect(elapsed).toBeGreaterThanOrEqual(expectedMin);
        expect(elapsed).toBeLessThanOrEqual(expectedMax);
        expect(token.cancellationReason).toBe(reason);
        expect(token.isCancellationRequested).toBe(true);
    }
);

test('throwIfCancellationRequested should not throw, if cancellation wasn\'t requested',
    () =>
    {
        const token = new TaskCancellationToken();
        const action = () => token.throwIfCancellationRequested();
        expect(action).not.toThrow();
    }
);

test('throwIfCancellationRequested should throw, if cancellation was requested',
    () =>
    {
        const token = new TaskCancellationToken();
        token.cancel();

        let error: any = void(0);
        try
        {
            token.throwIfCancellationRequested();
        }
        catch (e)
        {
            error = e;
        }
        finally
        {
            expect(error).toBeDefined();
            expect(error.constructor).toBe(TaskCancellationError);
            expect(error.message).not.toMatch(/.*reason:.*/g);
        }
    }
);

test('throwIfCancellationRequested should throw, if cancellation was requested, with reason',
    () =>
    {
        const reason = 'foo';
        const token = new TaskCancellationToken();
        token.cancel(reason);

        let error: any = void(0);
        try
        {
            token.throwIfCancellationRequested();
        }
        catch (e)
        {
            error = e;
        }
        finally
        {
            expect(error).toBeDefined();
            expect(error.constructor).toBe(TaskCancellationError);
            expect(error.message).toMatch(/.*reason:.*/g);
            expect(error.message).toMatch(new RegExp(`.*${reason}.*`, 'g'));
        }
    }
);
