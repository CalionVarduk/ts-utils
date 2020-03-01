import { DeferredAction, DeferredActionParams } from '../core/deferred-action';
import { wait } from '../core/functions/wait';
import each from 'jest-each';
import { MIN_TIME_OFFSET, MAX_TIME_OFFSET } from './helpers';

type Args = { a: string };

class Action
{
    public isInvoked: boolean = false;
    public args?: Args = void(0);
    public time?: number = void(0);

    public constructor(public readonly test: (a: Action) => void) {}

    public readonly function: (args?: Args) => void = args =>
    {
        this.isInvoked = true;
        this.args = args;
        this.time = Date.now();
        this.test(this);
    }
}

test('ctor should create with proper params',
    () =>
    {
        const params: DeferredActionParams<Args> =
        {
            timeoutMs: 10,
            action: () => {}
        };
        const deferred = new DeferredAction(params);
        expect(deferred.timeoutMs).toBe(params.timeoutMs);
        expect(deferred.action).toBe(params.action);
        expect(deferred.isInvoking).toBe(false);
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
.test('invoke should call action properly (%#): timeoutMs: %f',
    async (timeoutMs: number) =>
    {
        let start: number | null = null;
        const args: Args = { a: 'a' };
        const action = new Action(a =>
            {
                const elapsed = a.time! - start!;
                const min = timeoutMs - MIN_TIME_OFFSET;
                const max = timeoutMs + MAX_TIME_OFFSET;
                expect(a.args).toBe(args);
                expect(elapsed).toBeGreaterThanOrEqual(min);
                expect(elapsed).toBeLessThanOrEqual(max);
            });
        const params: DeferredActionParams<Args> =
        {
            timeoutMs: timeoutMs,
            action: action.function
        };
        const deferred = new DeferredAction(params);
        start = Date.now();
        deferred.invoke(args);
        expect(deferred.isInvoking).toBe(true);
        await wait(params.timeoutMs + MAX_TIME_OFFSET);
        expect(action.isInvoked).toBe(true);
        expect(deferred.isInvoking).toBe(false);
    }
);

test('stop should return false if is not invoking',
    () =>
    {
        const params: DeferredActionParams<Args> =
        {
            timeoutMs: 10,
            action: () => {}
        };
        const deferred = new DeferredAction(params);
        const result = deferred.stop();
        expect(result).toBe(false);
    }
);

test('stop should return true and stop invocation if is invoking',
    () =>
    {
        const params: DeferredActionParams<Args> =
        {
            timeoutMs: 10,
            action: () => {}
        };
        const deferred = new DeferredAction(params);
        deferred.invoke();
        const result = deferred.stop();
        expect(deferred.isInvoking).toBe(false);
        expect(result).toBe(true);
    }
);
