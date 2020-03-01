import { StopWatch } from '../core/stopwatch';
import { wait } from '../core/functions/wait';
import { MIN_TIME_OFFSET, MAX_TIME_OFFSET } from './helpers';

test('ctor should create with proper value',
    () =>
    {
        const watch1 = new StopWatch();
        const watch2 = new StopWatch(false);
        const watch3 = new StopWatch(true);
        expect(watch1.isRunning).toBe(false);
        expect(watch1.startPointMs).toBe(watch1.endPointMs);
        expect(watch1.elapsedMs).toBe(0);
        expect(watch2.isRunning).toBe(false);
        expect(watch2.startPointMs).toBe(watch2.endPointMs);
        expect(watch2.elapsedMs).toBe(0);
        expect(watch3.isRunning).toBe(true);
        expect(watch3.elapsedMs).toBeGreaterThanOrEqual(0);
        expect(watch3.startPointMs).toBeLessThanOrEqual(watch3.endPointMs);
    }
);

test('start should return false when stopwatch is already running',
    () =>
    {
        const watch = new StopWatch(true);
        const result = watch.start();
        expect(result).toBe(false);
    }
);

test('start should return true and start the stopwatch when it wasn\'t running yet',
    async () =>
    {
        const waitTime = 200;
        const watch = new StopWatch();
        const result = watch.start();
        await wait(waitTime);
        expect(result).toBe(true);
        expect(watch.isRunning).toBe(true);
        expect(watch.elapsedMs).toBeGreaterThanOrEqual(waitTime - MIN_TIME_OFFSET);
        expect(watch.elapsedMs).toBeLessThanOrEqual(waitTime + MAX_TIME_OFFSET);
        expect(watch.startPointMs).toBeLessThanOrEqual(watch.endPointMs);
    }
);

test('stop should return false when stopwatch was already stopped',
    () =>
    {
        const watch = new StopWatch();
        const result = watch.stop();
        expect(result).toBe(false);
    }
);

test('stop should return true and stop the stopwatch if it was running',
    async () =>
    {
        const waitTime = 200;
        const watch = new StopWatch(true);
        await wait(waitTime);
        const result = watch.stop();
        expect(result).toBe(true);
        expect(watch.isRunning).toBe(false);
        expect(watch.elapsedMs).toBeGreaterThanOrEqual(waitTime - MIN_TIME_OFFSET);
        expect(watch.elapsedMs).toBeLessThanOrEqual(waitTime + MAX_TIME_OFFSET);
        expect(watch.startPointMs).toBeLessThanOrEqual(watch.endPointMs);
    }
);

test('restart should run the stopwatch again',
    async () =>
    {
        const waitTime = 200;
        const watch = new StopWatch(true);
        await wait(waitTime);
        watch.restart();
        await wait(waitTime);
        expect(watch.isRunning).toBe(true);
        expect(watch.elapsedMs).toBeGreaterThanOrEqual(waitTime - MIN_TIME_OFFSET);
        expect(watch.elapsedMs).toBeLessThanOrEqual(waitTime + MAX_TIME_OFFSET);
        expect(watch.startPointMs).toBeLessThanOrEqual(watch.endPointMs);
    }
);
