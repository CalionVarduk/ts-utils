import { RepeatedAction, RepeatedActionParams, RepeatedActionResult } from '../src/repeated-action';
import { wait } from '../src/functions/wait';
import { MIN_TIME_OFFSET, MAX_TIME_OFFSET } from './helpers';
import each from 'jest-each';

type Args = { a: string };

class Action
{
    public get lastInfo(): { args?: Args; time: number }
    {
        return this.invocationInfo[this.invocationInfo.length - 1];
    }

    public readonly invocationInfo: { args?: Args; time: number }[] = [];

    public constructor(public readonly repeatCount: number, public readonly test: (a: Action) => void) {}

    public readonly function: (args?: Args) => RepeatedActionResult = args =>
    {
        this.invocationInfo.push({ args: args, time: Date.now() });
        this.test(this);
        return this.invocationInfo.length === this.repeatCount ? RepeatedActionResult.Done : RepeatedActionResult.Continue;
    }
}

test('ctor should create with proper params',
    () =>
    {
        const params: RepeatedActionParams<Args> =
        {
            intervalMs: 10,
            action: () => RepeatedActionResult.Done
        };
        const repeated = new RepeatedAction(params);
        expect(repeated.intervalMs).toBe(params.intervalMs);
        expect(repeated.action).toBe(params.action);
        expect(repeated.isRunning).toBe(false);
        expect(repeated.invocationCount).toBe(0);
    }
);

each([
    [-1, 3],
    [0, 2],
    [5, 1],
    [10, 10],
    [50, 4],
    [100, 2],
    [200, 2],
    [300, 1],
    [400, 1],
    [500, 1]
])
.test('invoke should call action properly (%#): intervalMs: %f, repeatCount: %f',
    async (intervalMs: number, repeatCount: number) =>
    {
        let start: number | null = null;
        const args: Args = { a: 'a' };
        const action = new Action(repeatCount, a =>
            {
                const elapsed = a.lastInfo.time! -
                    (a.invocationInfo.length === 1 ? start! : a.invocationInfo[a.invocationInfo.length - 2].time!);
                const min = intervalMs - MIN_TIME_OFFSET;
                const max = intervalMs + MAX_TIME_OFFSET;
                expect(a.lastInfo.args).toBe(args);
                expect(elapsed).toBeGreaterThanOrEqual(min);
                expect(elapsed).toBeLessThanOrEqual(max);
            });
        const params: RepeatedActionParams<Args> =
        {
            intervalMs: intervalMs,
            action: action.function
        };
        const repeated = new RepeatedAction(params);
        start = Date.now();
        repeated.invoke(args);
        expect(repeated.isRunning).toBe(true);
        await wait((params.intervalMs + MAX_TIME_OFFSET) * repeatCount);
        expect(action.invocationInfo.length).toBe(repeatCount);
        expect(repeated.isRunning).toBe(false);
    }
);

test('stop should return false if is not invoking',
    () =>
    {
        const params: RepeatedActionParams<Args> =
        {
            intervalMs: 10,
            action: () => RepeatedActionResult.Done
        };
        const repeated = new RepeatedAction(params);
        const result = repeated.stop();
        expect(result).toBe(false);
    }
);

test('stop should return true and stop invocation if is invoking',
    () =>
    {
        const params: RepeatedActionParams<Args> =
        {
            intervalMs: 10,
            action: () => RepeatedActionResult.Done
        };
        const repeated = new RepeatedAction(params);
        repeated.invoke();
        const result = repeated.stop();
        expect(repeated.isRunning).toBe(false);
        expect(result).toBe(true);
    }
);
