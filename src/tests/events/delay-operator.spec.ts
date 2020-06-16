import { EventHandler } from '../../core/events/event-handler';
import { delay } from '../../core/events/operators/delay';
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
.test('delay operator should delay events correctly (%#): delay ms: %f',
    async (ms: number) =>
    {
        const args = 'foo';
        const sender = {};

        const interceptedData: { sender: any; args: any; event: IEvent; end: number }[] = [];

        const handler = new EventHandler();

        handler.listen((s, a, e) => interceptedData.push({ sender: s, args: a, event: e, end: Date.now() }))
            .decorate(delay(ms));

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

test('delay operator should be ignored with negative ms',
    () =>
    {
        let delegateCalled = false;
        const handler = new EventHandler();

        handler.listen(() => delegateCalled = true)
            .decorate(delay(-1));

        handler.publish();
        expect(delegateCalled).toBe(true);
    }
);
