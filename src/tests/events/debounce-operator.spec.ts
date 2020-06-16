import { EventHandler } from '../../core/events/event-handler';
import { debounce } from '../../core/events/operators/debounce';
import { IEvent } from '../../core/events/event.interface';
import { MIN_TIME_OFFSET, MAX_TIME_OFFSET } from '../helpers';
import { wait } from '../../core/functions';
import each from 'jest-each';

each([
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
.test('debounce operator should delay events correctly (%#): delay ms: %f',
    async (ms: number) =>
    {
        const args = 'foo';
        const sender = {};

        const interceptedData: { sender: any; args: any; event: IEvent; end: number }[] = [];

        const handler = new EventHandler();

        handler.listen((s, a, e) => interceptedData.push({ sender: s, args: a, event: e, end: Date.now() }))
            .decorate(debounce(ms));

        const start = Date.now();
        handler.publish(sender, args);
        expect(interceptedData.length).toBe(0);

        await wait(ms + MAX_TIME_OFFSET);

        expect(interceptedData.length).toBe(1);
        expect(interceptedData[0].sender).toBe(sender);
        expect(interceptedData[0].args).toBe(args);
        expect(interceptedData[0].event).toBe(handler);

        const min = ms - MIN_TIME_OFFSET;
        const max = ms + MAX_TIME_OFFSET;
        expect(interceptedData[0].end - start).toBeGreaterThanOrEqual(min);
        expect(interceptedData[0].end - start).toBeLessThanOrEqual(max);
    }
);

test('debounce operator should be ignored with negative ms',
    () =>
    {
        let delegateCalled = false;
        const handler = new EventHandler();

        handler.listen(() => delegateCalled = true)
            .decorate(debounce(-1));

        handler.publish();
        expect(delegateCalled).toBe(true);
    }
);

test('debounce operator should reset listener delegate invocation',
    async () =>
    {
        const ms = 200;
        let end = 0;
        const handler = new EventHandler();

        handler.listen(() => end = Date.now())
            .decorate(debounce(ms));

        const start = Date.now();
        handler.publish();
        wait(ms / 2).then(() => handler.publish());

        await wait(ms + MAX_TIME_OFFSET);

        expect(end).toBe(0);

        await wait(ms / 2 + MAX_TIME_OFFSET);

        const min = ms * 1.5 - MIN_TIME_OFFSET;
        const max = ms * 1.5 + MAX_TIME_OFFSET;
        expect(end - start).toBeGreaterThanOrEqual(min);
        expect(end - start).toBeLessThanOrEqual(max);
    }
);
